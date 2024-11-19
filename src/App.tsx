import React from 'react';
import { Layout, Settings } from 'lucide-react';
import { Preview } from './components/Preview';
import { Timeline } from './components/Timeline';
import { MediaLibrary } from './components/MediaLibrary';
import { Effects } from './components/Effects';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="text-blue-500" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                AI Video Creator
              </h1>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            <MediaLibrary />
            <Effects />
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            <Preview />
            <Timeline />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;