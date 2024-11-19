import React, { useState } from 'react';
import { Sparkles, Wand2, Sliders, Palette, Wind, Waves } from 'lucide-react';
import { Button } from './ui/Button';

interface Effect {
  id: string;
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  settings?: {
    id: string;
    name: string;
    type: 'slider' | 'select';
    value: number | string;
    options?: string[];
    min?: number;
    max?: number;
  }[];
}

export const Effects: React.FC = () => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [effects] = useState<Effect[]>([
    {
      id: 'ken-burns',
      name: 'Ken Burns',
      icon: Wand2,
      settings: [
        { id: 'zoom', name: 'Zoom', type: 'slider', value: 50, min: 0, max: 100 },
        { id: 'duration', name: 'Duration', type: 'slider', value: 75, min: 0, max: 100 },
      ],
    },
    {
      id: 'ai-enhancement',
      name: 'AI Enhancement',
      icon: Sparkles,
      settings: [
        { id: 'strength', name: 'Strength', type: 'slider', value: 60, min: 0, max: 100 },
        { id: 'style', name: 'Style', type: 'select', value: 'cinematic', options: ['cinematic', 'vintage', 'modern'] },
      ],
    },
    {
      id: 'color-grading',
      name: 'Color Grading',
      icon: Palette,
      settings: [
        { id: 'contrast', name: 'Contrast', type: 'slider', value: 50, min: 0, max: 100 },
        { id: 'saturation', name: 'Saturation', type: 'slider', value: 50, min: 0, max: 100 },
      ],
    },
    {
      id: 'transitions',
      name: 'Transitions',
      icon: Wind,
      settings: [
        { id: 'type', name: 'Type', type: 'select', value: 'fade', options: ['fade', 'slide', 'zoom'] },
        { id: 'duration', name: 'Duration', type: 'slider', value: 50, min: 0, max: 100 },
      ],
    },
    {
      id: 'audio-effects',
      name: 'Audio Effects',
      icon: Waves,
      settings: [
        { id: 'reverb', name: 'Reverb', type: 'slider', value: 30, min: 0, max: 100 },
        { id: 'echo', name: 'Echo', type: 'slider', value: 20, min: 0, max: 100 },
      ],
    },
  ]);

  const handleSettingChange = (effectId: string, settingId: string, value: string) => {
    // Handle setting changes through a store or context
    console.log('Effect setting changed:', { effectId, settingId, value });
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Effects</h3>
        {selectedEffect && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedEffect(null)}
          >
            <Sliders size={14} className="mr-2" />
            Settings
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {effects.map((effect) => (
          <div key={effect.id}>
            <button
              onClick={() => setSelectedEffect(effect.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                selectedEffect === effect.id
                  ? 'bg-blue-500/20 text-white border border-blue-500/50'
                  : 'bg-gray-800 hover:bg-gray-800/80 text-gray-300 hover:text-white'
              }`}
            >
              <effect.icon size={16} className="text-blue-500" />
              {effect.name}
            </button>

            {selectedEffect === effect.id && effect.settings && (
              <div className="mt-2 ml-8 space-y-3">
                {effect.settings.map((setting) => (
                  <div key={setting.id} className="space-y-1">
                    <label className="text-sm text-gray-400">{setting.name}</label>
                    {setting.type === 'slider' ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          value={setting.value as number}
                          onChange={(e) => handleSettingChange(effect.id, setting.id, e.target.value)}
                          className="flex-1 accent-blue-500"
                        />
                        <span className="text-sm text-gray-400 min-w-[3ch]">
                          {setting.value}%
                        </span>
                      </div>
                    ) : (
                      <select 
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(effect.id, setting.id, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-gray-300"
                      >
                        {setting.options?.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};