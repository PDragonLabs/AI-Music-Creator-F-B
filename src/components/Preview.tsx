import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Maximize2 } from 'lucide-react';
import { Button } from './ui/Button';
import { DownloadModal } from './DownloadModal';

export const Preview: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <>
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="relative group">
          <div className="aspect-video bg-black flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80" 
              alt="Preview"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm">
              <Maximize2 size={16} />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-blue-500"></div>
              </div>
              <span className="text-sm text-gray-400">0:00 / 2:30</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDownloadModal(true)}
            >
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </>
  );
};