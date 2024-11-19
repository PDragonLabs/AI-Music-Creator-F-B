import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ffmpegPath = join(__dirname, '../node_modules/@ffmpeg/core/dist');
const publicPath = join(__dirname, '../public/ffmpeg');

async function copyFFmpegFiles() {
  try {
    await mkdir(publicPath, { recursive: true });
    
    const files = [
      'ffmpeg-core.js',
      'ffmpeg-core.wasm',
      'ffmpeg-core.worker.js'
    ];

    for (const file of files) {
      await copyFile(
        join(ffmpegPath, file),
        join(publicPath, file)
      );
    }

    console.log('FFmpeg files copied successfully');
  } catch (error) {
    console.error('Error copying FFmpeg files:', error);
    process.exit(1);
  }
}

copyFFmpegFiles();