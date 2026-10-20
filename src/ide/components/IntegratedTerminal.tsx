import React, { useState, useRef, useEffect } from 'react';
import { TerminalEntry } from '../types/ide';
import { TerminalSessionsBar } from './TerminalSessionsBar';

interface TerminalProps {
  entries: TerminalEntry[];
  onRunCommand: (cmd: string, shell?: string) => void;
  onClear: () => void;
  height: number;
}

export const IntegratedTerminal: React.FC<TerminalProps> = (p) => {
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<string[]>(['1: bash', '2: pwsh', '3: node']);
  const [activeSession, setActiveSession] = useState('1: bash');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [p.entries]);
  const isPwsh = activeSession.includes('pwsh');
  const isNode = activeSession.includes('node');
  const prompt = isPwsh ? 'PS /app/applet>' : isNode ? '>' : 'user@workspace:~/applet (main) $';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    p.onRunCommand(input.trim(), isPwsh ? 'pwsh' : isNode ? 'node' : 'bash');
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && p.entries.length > 0) {
      e.preventDefault();
      const nextIdx = historyIndex === -1 ? p.entries.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(p.entries[nextIdx].command);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < p.entries.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInput(p.entries[historyIndex + 1].command);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const quickPills = [
    { label: 'npm i zod', cmd: 'npm i zod' },
    { label: 'npm audit fix --force', cmd: 'npm audit fix --force' },
    { label: 'npm test', cmd: 'npm test' },
    { label: isPwsh ? 'Get-ChildItem' : 'ls -la', cmd: isPwsh ? 'Get-ChildItem' : 'ls -la' },
  ];

  return (
    <div style={{ height: `${p.height}px` }} className="bg-slate-950 flex flex-col font-mono text-xs select-none">
      <TerminalSessionsBar sessions={sessions} activeSession={activeSession} onSelectSession={setActiveSession} onNewTerminal={() => setSessions((prev) => [...prev, `${prev.length + 1}: ${isPwsh ? 'pwsh' : 'bash'}`])} onClear={p.onClear} />
      <div className="flex-1 overflow-y-auto p-3 space-y-2 select-text font-mono text-slate-200">
        {p.entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className={isPwsh ? 'text-sky-400 font-semibold' : 'text-emerald-400 font-semibold'}>{prompt}</span>
              <span className="text-white font-semibold">{entry.command}</span>
              {entry.durationMs && <span className="text-slate-600 text-[10px] ml-auto">({entry.durationMs}ms)</span>}
            </div>
            {entry.output && (
              <pre className={`text-[11px] whitespace-pre-wrap pl-3 border-l-2 ${entry.status === 'error' ? 'text-rose-400 border-rose-800' : 'text-slate-300 border-slate-800'}`}>{entry.output}</pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-2 pt-1 flex items-center gap-1.5 overflow-x-auto bg-slate-950 border-t border-slate-900/60">
        <span className="text-[10px] text-slate-500 font-sans">Quick:</span>
        {quickPills.map((pill) => (
          <button key={pill.label} onClick={() => p.onRunCommand(pill.cmd, isPwsh ? 'pwsh' : 'bash')} className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap">{pill.label}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-2 bg-slate-950 flex items-center gap-2 text-[11px]">
        <span className={isPwsh ? 'text-sky-400 font-semibold' : 'text-emerald-400 font-semibold'}>{prompt}</span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={isPwsh ? "PowerShell (e.g. 'npm i zod', 'Get-ChildItem')..." : "Bash (e.g. 'npm i zod', 'npm test')..."} className="flex-1 bg-transparent text-white outline-none font-mono text-xs" />
      </form>
    </div>
  );
};
