import React, { useState } from 'react';
import { Settings, X, KeyRound, Palette } from 'lucide-react';
import { EditorSettings } from '../types/ide';
import { CloudflareSettingsTab } from './CloudflareSettingsTab';
import { AppearanceSettingsTab } from './AppearanceSettingsTab';

interface SettingsModalProps {
  settings: EditorSettings;
  onUpdate: (updated: Partial<EditorSettings>) => void;
  accountId: string;
  apiToken: string;
  onSaveCredentials: (acc: string, tok: string) => void;
  onClose: () => void;
}

export const EditorSettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdate,
  accountId,
  apiToken,
  onSaveCredentials,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cloudflare' | 'appearance'>('cloudflare');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans text-xs text-slate-200">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Settings className="w-4 h-4 text-orange-400" />
            <span>IDE Settings &amp; Cloudflare Credentials</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-4 pt-3 flex gap-2 border-b border-slate-800/80 bg-slate-950">
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-2 px-2 text-xs flex items-center gap-1.5 border-b-2 font-medium ${
              activeTab === 'cloudflare' ? 'border-orange-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-orange-400" />
            <span>Cloudflare Workers AI Auth</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`pb-2 px-2 text-xs flex items-center gap-1.5 border-b-2 font-medium ${
              activeTab === 'appearance' ? 'border-orange-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Editor Appearance</span>
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'cloudflare' ? (
            <CloudflareSettingsTab
              accountId={accountId}
              apiToken={apiToken}
              onSaveCredentials={onSaveCredentials}
            />
          ) : (
            <AppearanceSettingsTab settings={settings} onUpdate={onUpdate} />
          )}
        </div>

        <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
