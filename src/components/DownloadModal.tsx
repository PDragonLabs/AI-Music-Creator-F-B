import React, { useState, useEffect } from 'react';
import { Download, X, Settings2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useVideoStore } from '../store/videoStore';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [resolution, setResolution] = useState('1920x1080');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState(80);
  const { initFFmpeg, exportVideo, isReady, isProcessing, progress } = useVideoStore();

  useEffect(() => {
    initFFmpeg().catch(console.error);
  }, [initFFmpeg]);

  const handleExport = async () => {
    try {
      const videoUrl = await exportVideo({ resolution, format, quality });
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `video.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);
    } catch (error) {
      console.error('Export failed:', error);
      // Show error message to user
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Export Video</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
            <select 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
            >
              <option value="1920x1080">1080p (1920x1080)</option>
              <option value="1280x720">720p (1280x720)</option>
              <option value="854x480">480p (854x480)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300"
            >
              <option value="mp4">MP4 (H.264)</option>
              <option value="webm">WebM (VP9)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-gray-300 min-w-[3ch]">{quality}%</span>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 text-center">
                Processing: {progress}%
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleExport}
              disabled={!isReady || isProcessing}
            >
              <Download size={16} className="mr-2" />
              {isProcessing ? 'Processing...' : 'Export Video'}
            </Button>
            <button className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white">
              <Settings2 size={14} />
              Advanced Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};