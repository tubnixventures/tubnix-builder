import React from 'react';
import { Undo2, Redo2, Save, Sparkles, Check } from 'lucide-react';
import { SupportedLanguage } from '../types/ide';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  language: SupportedLanguage;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onTriggerInlineAi: () => void;
}

export const EditorToolbar: React.FC<ToolbarProps> = ({
  canUndo,
  canRedo,
  isDirty,
  language,
  onUndo,
  onRedo,
  onSave,
  onTriggerInlineAi,
}) => {
  return (
    <div className="h-8 bg-slate-950/70 border-b border-slate-800/60 flex items-center justify-between px-3 text-xs select-none">
      <div className="flex items-center gap-1 text-slate-400">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1 rounded hover:bg-slate-900 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          className="p-1 rounded hover:bg-slate-900 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />

        <button
          onClick={onSave}
          title="Save file (Ctrl+S)"
          className={`px-2 py-0.5 rounded flex items-center gap-1 font-mono text-[11px] transition-colors ${
            isDirty
              ? 'bg-orange-600/80 hover:bg-orange-500 text-white font-medium'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isDirty ? <Save className="w-3 h-3" /> : <Check className="w-3 h-3 text-emerald-400" />}
          <span>{isDirty ? 'Save' : 'Saved'}</span>
        </button>

        <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />

        <button
          onClick={onTriggerInlineAi}
          title="Trigger Inline AI Suggestion (Alt+\ or Tab)"
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-800 flex items-center gap-1 text-[11px]"
        >
          <Sparkles className="w-3 h-3" />
          <span>Inline Suggest</span>
        </button>
      </div>

      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
        <span className="uppercase text-slate-400 font-semibold">{language}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
