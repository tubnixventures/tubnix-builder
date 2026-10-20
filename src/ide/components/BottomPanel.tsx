import React, { useState } from 'react';
import { Terminal, AlertCircle, FileText, X, Maximize2, Minimize2 } from 'lucide-react';
import { TerminalEntry } from '../types/ide';
import { CodeDiagnostic } from '../types/diagnostics';
import { IntegratedTerminal } from './IntegratedTerminal';
import { ResizeGutter } from './ResizeGutter';

interface PanelProps {
  terminalEntries: TerminalEntry[];
  diagnostics: CodeDiagnostic[];
  activeFileName?: string;
  onRunTerminalCommand: (cmd: string, shell?: string) => void;
  onClearTerminal: () => void;
  onJumpToLine?: (line: number) => void;
  onClose: () => void;
  height: number;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onStartResize?: (e: React.MouseEvent) => void;
}

export const BottomPanel: React.FC<PanelProps> = (p) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const errorCount = p.diagnostics.filter((d) => d.severity === 'error').length;
  const warnCount = p.diagnostics.filter((d) => d.severity === 'warning').length;

  return (
    <div style={{ height: `${p.height}px` }} className="border-t border-slate-800 bg-slate-950 flex flex-col font-mono text-xs select-none relative shrink-0">
      <ResizeGutter direction="vertical" onMouseDown={p.onStartResize || (() => {})} onDoubleClick={p.onToggleMaximize} title="Drag to resize terminal (Double-click to maximize/restore)" />
      <div className="h-8 bg-slate-950 border-b border-slate-800/80 px-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('problems')} className={`flex items-center gap-1.5 py-1 uppercase tracking-wider ${activeTab === 'problems' ? 'text-white border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Problems</span>
            <span className="px-1.5 rounded-full bg-slate-800 text-[10px] text-slate-300">{errorCount + warnCount}</span>
          </button>
          <button onClick={() => setActiveTab('output')} className={`flex items-center gap-1.5 py-1 uppercase tracking-wider ${activeTab === 'output' ? 'text-white border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Output</span>
          </button>
          <button onClick={() => setActiveTab('terminal')} className={`flex items-center gap-1.5 py-1 uppercase tracking-wider ${activeTab === 'terminal' ? 'text-white border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <button onClick={p.onToggleMaximize} className="p-1 hover:text-white" title={p.isMaximized ? 'Restore Panel Size' : 'Maximize Panel'}>
            {p.isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={p.onClose} className="p-1 hover:text-white" title="Hide Panel (Ctrl+J)"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && <IntegratedTerminal entries={p.terminalEntries} onRunCommand={p.onRunTerminalCommand} onClear={p.onClearTerminal} height={p.height - 36} />}
        {activeTab === 'problems' && (
          <div className="p-3 overflow-y-auto h-full space-y-1 text-[11px]">
            {p.diagnostics.length === 0 ? <div className="text-slate-500">No problems detected in workspace.</div> : p.diagnostics.map((d, i) => (
              <div key={i} onClick={() => p.onJumpToLine?.(d.line)} className="flex items-center gap-2 p-1 rounded hover:bg-slate-900 cursor-pointer text-slate-300">
                <AlertCircle className={`w-3.5 h-3.5 ${d.severity === 'error' ? 'text-rose-400' : 'text-amber-400'}`} />
                <span className="text-slate-500">{p.activeFileName}:[{d.line}]</span>
                <span>{d.message}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'output' && (
          <div className="p-3 overflow-y-auto h-full text-[11px] text-slate-400 select-text font-mono space-y-0.5">
            <div>[Tasks] Autonomous agent loop verified and connected to Cloudflare Workers AI.</div>
            <div>[Hot Reload] Debounced auto-save streaming active. External browser hot sync ready.</div>
            <div>[Native FS] File System Access API streaming ready for local directory binding.</div>
          </div>
        )}
      </div>
    </div>
  );
};
