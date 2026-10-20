import React from 'react';
import { EditorSettings } from '../types/ide';

interface AppearanceTabProps {
  settings: EditorSettings;
  onUpdate: (updated: Partial<EditorSettings>) => void;
}

export const AppearanceSettingsTab: React.FC<AppearanceTabProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-3 font-sans text-xs">
      <div>
        <label className="block text-slate-400 mb-1">Editor Font Size: {settings.fontSize}px</label>
        <input
          type="range"
          min="10"
          max="24"
          value={settings.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="w-full accent-orange-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 mb-1">Theme (VS Code Emulation)</label>
        <select
          value={settings.theme}
          onChange={(e) => onUpdate({ theme: e.target.value as EditorSettings['theme'] })}
          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white outline-none"
        >
          <option value="dark-modern">Dark Modern (VS Code Default)</option>
          <option value="one-dark">One Dark Pro</option>
          <option value="monokai">Monokai Pro</option>
          <option value="cyberpunk">Cyberpunk Neon</option>
          <option value="light">GitHub Light</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.wordWrap}
            onChange={(e) => onUpdate({ wordWrap: e.target.checked })}
            className="accent-orange-500"
          />
          <span>Word Wrap</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showLineNumbers}
            onChange={(e) => onUpdate({ showLineNumbers: e.target.checked })}
            className="accent-orange-500"
          />
          <span>Line Numbers</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.inlineAiEnabled}
            onChange={(e) => onUpdate({ inlineAiEnabled: e.target.checked })}
            className="accent-orange-500"
          />
          <span>Inline Ghost AI</span>
        </label>
      </div>
    </div>
  );
};
