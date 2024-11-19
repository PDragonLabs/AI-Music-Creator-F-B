import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioWaveformProps {
  url: string;
  isPlaying: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  url,
  isPlaying,
  onReady,
  onPlay,
  onPause,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let ws: WaveSurfer | null = null;

    const initWaveSurfer = async () => {
      if (!containerRef.current || !mounted) return;

      try {
        ws = WaveSurfer.create({
          container: containerRef.current,
          waveColor: '#3b82f6',
          progressColor: '#60a5fa',
          cursorColor: '#93c5fd',
          barWidth: 2,
          barGap: 1,
          height: 32,
          normalize: true,
          backend: 'WebAudio',
          minPxPerSec: 50,
        });

        ws.on('ready', () => {
          if (mounted) {
            setIsLoading(false);
            onReady?.();
          }
        });

        ws.on('play', onPlay);
        ws.on('pause', onPause);
        ws.on('error', (err) => {
          if (mounted) {
            console.error('WaveSurfer error:', err);
            setError('Failed to load audio');
            setIsLoading(false);
          }
        });

        wavesurfer.current = ws;

        try {
          await ws.load(url);
        } catch (err) {
          if (mounted) {
            console.error('Failed to load audio:', err);
            setError('Failed to load audio');
            setIsLoading(false);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('WaveSurfer initialization error:', err);
          setError('Failed to initialize audio player');
          setIsLoading(false);
        }
      }
    };

    initWaveSurfer();

    return () => {
      mounted = false;
      if (ws) {
        ws.destroy();
      }
    };
  }, [url, onReady, onPlay, onPause]);

  useEffect(() => {
    const ws = wavesurfer.current;
    if (!ws) return;

    try {
      if (isPlaying && !ws.isPlaying()) {
        ws.play();
      } else if (!isPlaying && ws.isPlaying()) {
        ws.pause();
      }
    } catch (err) {
      console.error('Playback control error:', err);
    }
  }, [isPlaying]);

  if (error) {
    return (
      <div className="w-full h-8 bg-gray-800 rounded flex items-center justify-center">
        <span className="text-sm text-red-400">{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-8 bg-gray-800 rounded flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading audio...</span>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full bg-gray-800 rounded" />;
};