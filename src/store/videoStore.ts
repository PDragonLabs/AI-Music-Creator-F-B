import { create } from 'zustand';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface VideoState {
  ffmpeg: FFmpeg | null;
  isReady: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  initFFmpeg: () => Promise<void>;
  exportVideo: (options: ExportOptions) => Promise<string>;
}

interface ExportOptions {
  resolution: string;
  format: string;
  quality: number;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  ffmpeg: null,
  isReady: false,
  isProcessing: false,
  progress: 0,
  error: null,

  initFFmpeg: async () => {
    if (get().ffmpeg) return;

    try {
      const ffmpeg = new FFmpeg();
      
      ffmpeg.on('progress', ({ progress }) => {
        set({ progress: Math.round(progress * 100) });
      });

      // Load FFmpeg with dynamic imports
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      set({ ffmpeg, isReady: true, error: null });
    } catch (error) {
      console.error('FFmpeg initialization failed:', error);
      set({ error: 'Failed to initialize video processor' });
    }
  },

  exportVideo: async ({ resolution, format, quality }) => {
    const { ffmpeg } = get();
    if (!ffmpeg) throw new Error('FFmpeg not initialized');

    set({ isProcessing: true, progress: 0, error: null });

    try {
      const [width, height] = resolution.split('x').map(Number);
      
      // Write input files
      await ffmpeg.writeFile('input.mp4', await fetchFile('input.mp4'));
      await ffmpeg.writeFile('audio.mp3', await fetchFile('audio.mp3'));

      // Construct FFmpeg command with optimized settings
      const command = [
        '-i', 'input.mp4',
        '-i', 'audio.mp3',
        '-c:v', format === 'webm' ? 'libvpx-vp9' : 'libx264',
        '-b:v', '2M',
        '-preset', 'medium',
        '-deadline', 'good',
        '-cpu-used', '2',
        '-crf', String(Math.round(51 - (quality * 0.51))),
        '-c:a', format === 'webm' ? 'libvorbis' : 'aac',
        '-b:a', '192k',
        '-s', `${width}x${height}`,
        '-movflags', '+faststart',
        `output.${format}`
      ];

      await ffmpeg.exec(command);

      // Read the output file
      const data = await ffmpeg.readFile(`output.${format}`);
      const blob = new Blob([data], { type: `video/${format}` });
      const url = URL.createObjectURL(blob);

      set({ isProcessing: false, progress: 100, error: null });
      return url;
    } catch (error) {
      console.error('Video export failed:', error);
      set({ 
        isProcessing: false, 
        progress: 0, 
        error: 'Failed to export video. Please try again.' 
      });
      throw error;
    }
  },
}));