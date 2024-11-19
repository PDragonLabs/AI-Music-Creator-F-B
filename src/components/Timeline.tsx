import React, { useState } from 'react';
import { GripHorizontal, Plus, Video, Music, Volume2, VolumeX, Trash2, Copy, Settings } from 'lucide-react';
import { Button } from './ui/Button';

interface Track {
  id: number;
  type: 'video' | 'audio';
  icon: React.FC<{ size?: number }>;
  muted: boolean;
  volume: number;
  clips: { id: string; start: number; end: number; color: string }[];
}

export const Timeline: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 1,
      type: 'video',
      icon: Video,
      muted: false,
      volume: 100,
      clips: [
        { id: 'clip1', start: 0, end: 33, color: 'bg-blue-500/20' },
        { id: 'clip2', start: 33, end: 66, color: 'bg-purple-500/20' },
      ],
    },
    {
      id: 2,
      type: 'audio',
      icon: Music,
      muted: false,
      volume: 80,
      clips: [
        { id: 'clip3', start: 10, end: 90, color: 'bg-green-500/20' },
      ],
    },
  ]);

  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const toggleMute = (id: number) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, muted: !track.muted } : track
    ));
  };

  const updateVolume = (id: number, volume: number) => {
    setTracks(tracks.map(track =>
      track.id === id ? { ...track, volume } : track
    ));
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: Math.max(...tracks.map(t => t.id)) + 1,
      type: 'audio',
      icon: Music,
      muted: false,
      volume: 100,
      clips: [],
    };
    setTracks([...tracks, newTrack]);
  };

  const deleteTrack = (id: number) => {
    setTracks(tracks.filter(track => track.id !== id));
    setSelectedTrack(null);
  };

  const duplicateTrack = (id: number) => {
    const trackToDuplicate = tracks.find(track => track.id === id);
    if (trackToDuplicate) {
      const newTrack: Track = {
        ...trackToDuplicate,
        id: Math.max(...tracks.map(t => t.id)) + 1,
        clips: trackToDuplicate.clips.map(clip => ({
          ...clip,
          id: `${clip.id}-copy`,
        })),
      };
      setTracks([...tracks, newTrack]);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Timeline</h3>
        <Button variant="primary" size="sm" onClick={addTrack}>
          <Plus size={16} className="mr-2" /> Add Track
        </Button>
      </div>
      
      <div className="space-y-3">
        {tracks.map((track) => (
          <div 
            key={track.id} 
            className={`flex items-center gap-3 group ${
              selectedTrack === track.id ? 'bg-gray-800/50 rounded-lg p-2' : ''
            }`}
          >
            <div className="w-32 flex items-center gap-2 text-gray-400">
              <GripHorizontal size={16} className="opacity-50 group-hover:opacity-100 cursor-grab" />
              <track.icon size={16} />
              <span className="text-sm">Track {track.id}</span>
            </div>

            <div className="flex-1">
              <div 
                className="h-16 bg-gray-800 rounded-md border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer relative"
                onClick={() => setSelectedTrack(track.id === selectedTrack ? null : track.id)}
              >
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    style={{
                      left: `${clip.start}%`,
                      width: `${clip.end - clip.start}%`,
                    }}
                    className={`absolute top-0 h-full ${clip.color} border-r-2 border-r-blue-500/50`}
                  />
                ))}
              </div>

              {selectedTrack === track.id && (
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2">
                    <button
                      onClick={() => toggleMute(track.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      {track.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={track.volume}
                      onChange={(e) => updateVolume(track.id, Number(e.target.value))}
                      className="flex-1 accent-blue-500"
                    />
                    <span className="text-sm text-gray-400 min-w-[3ch]">{track.volume}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => duplicateTrack(track.id)}
                      className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <Settings size={14} />
                    </button>
                    <button
                      onClick={() => deleteTrack(track.id)}
                      className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 h-1 bg-blue-500/30 relative">
        <div className="absolute h-4 w-0.5 bg-blue-500 -top-1.5 left-1/3 cursor-ew-resize"></div>
      </div>
    </div>
  );
};