import React, { useState } from 'react';
import { Image, Music, Upload, X, Play, Pause } from 'lucide-react';
import { Button } from './ui/Button';
import { AudioWaveform } from './AudioWaveform';

interface MediaItem {
  id: string;
  type: 'image' | 'audio';
  name: string;
  duration?: string;
  thumbnail?: string;
  url?: string;
}

export const MediaLibrary: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Using more reliable audio URLs
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      name: 'Concert Stage.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80',
    },
    {
      id: '2',
      type: 'image',
      name: 'Crowd Shot.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80',
    },
    {
      id: '3',
      type: 'audio',
      name: 'Background Music.mp3',
      duration: '3:45',
      // Using a more reliable audio source
      url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    },
    {
      id: '4',
      type: 'audio',
      name: 'Ambient Sound.wav',
      duration: '2:30',
      // Using a more reliable audio source
      url: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop here
  };

  const togglePlay = (id: string) => {
    setPlaying(playing === id ? null : id);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Media Library</h3>
        <Button variant="primary" size="sm">
          <Upload size={16} className="mr-2" /> Upload
        </Button>
      </div>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-2 ${dragOver ? 'ring-2 ring-blue-500 rounded-lg p-2' : ''}`}
      >
        {mediaItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
            className={`group relative rounded-lg overflow-hidden transition-all ${
              selectedItem === item.id
                ? 'ring-2 ring-blue-500'
                : 'hover:ring-2 hover:ring-blue-500/50'
            }`}
          >
            {item.type === 'image' ? (
              <div className="aspect-video bg-gray-800">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="bg-gray-800 px-4 py-3">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(item.id);
                    }}
                    className="p-2 rounded-full bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors"
                  >
                    {playing === item.id ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <div>
                    <p className="text-sm text-gray-300">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.duration}</p>
                  </div>
                </div>
                {item.url && (
                  <AudioWaveform
                    url={item.url}
                    isPlaying={playing === item.id}
                    onPlay={() => setPlaying(item.id)}
                    onPause={() => setPlaying(null)}
                  />
                )}
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};