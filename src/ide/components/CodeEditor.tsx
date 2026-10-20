import React, { useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { EditorSettings, SupportedLanguage } from '../types/ide';
import { CodeEditorGutter } from './CodeEditorGutter';
import { validateCodeSyntax } from '../services/syntaxValidator';

interface EditorProps {
  content: string;
  language: SupportedLanguage;
  onChange: (newContent: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  settings: EditorSettings;
  inlineGhostText?: string;
  onAcceptGhostText?: () => void;
}

export const CodeEditor: React.FC<EditorProps> = (p) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = p.content.split('\n');
  const diagnostics = validateCodeSyntax(p.content, p.language);
  const errors = diagnostics.filter((d) => d.severity === 'error');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      p.onSave();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      e.shiftKey ? p.onRedo() : p.onUndo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      p.onRedo();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (p.inlineGhostText && p.onAcceptGhostText) {
        p.onAcceptGhostText();
      } else {
        const target = e.currentTarget;
        const spaces = ' '.repeat(p.settings.tabSize);
        const start = target.selectionStart;
        const updated = p.content.slice(0, start) + spaces + p.content.slice(target.selectionEnd);
        p.onChange(updated);
        setTimeout(() => { target.selectionStart = target.selectionEnd = start + spaces.length; }, 0);
      }
    }
  };

  return (
    <div className="relative flex-1 flex overflow-hidden bg-slate-950 font-mono text-slate-100">
      {p.settings.showLineNumbers && <CodeEditorGutter lines={lines} fontSize={p.settings.fontSize} diagnostics={diagnostics} />}
      <div className="relative flex-1 h-full overflow-auto">
        <textarea
          ref={textareaRef}
          value={p.content}
          onChange={(e) => p.onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full h-full p-3 bg-transparent text-slate-100 outline-none resize-none font-mono leading-relaxed"
          style={{
            fontSize: `${p.settings.fontSize}px`,
            fontFamily: p.settings.fontFamily,
            tabSize: p.settings.tabSize,
            whiteSpace: p.settings.wordWrap ? 'pre-wrap' : 'pre',
          }}
        />

        {errors.length > 0 && (
          <div className="absolute top-3 right-4 px-2.5 py-1 rounded bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[11px] flex items-center gap-1.5 shadow-lg select-none">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Line {errors[0].line}: {errors[0].message}</span>
          </div>
        )}

        {p.inlineGhostText && (
          <div className="absolute bottom-4 right-4 max-w-md p-2 rounded-lg bg-slate-900/90 border border-orange-500/40 text-orange-300 text-xs shadow-xl pointer-events-none">
            <div className="text-[10px] text-slate-400 mb-1">AI Suggestion (Press Tab to Accept):</div>
            <pre className="font-mono text-[11px] whitespace-pre-wrap">{p.inlineGhostText}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
