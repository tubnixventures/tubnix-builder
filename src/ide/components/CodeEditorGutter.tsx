import React from 'react';
import { CodeDiagnostic } from '../types/diagnostics';

interface GutterProps {
  lines: string[];
  fontSize: number;
  diagnostics?: CodeDiagnostic[];
}

export const CodeEditorGutter: React.FC<GutterProps> = ({ lines, fontSize, diagnostics = [] }) => {
  const errorLines = new Set(diagnostics.filter((d) => d.severity === 'error').map((d) => d.line));
  const warnLines = new Set(diagnostics.filter((d) => d.severity === 'warning').map((d) => d.line));

  return (
    <div
      className="w-13 py-3 pr-2 text-right bg-slate-950/90 text-slate-600 select-none border-r border-slate-800/40 shrink-0 font-mono"
      style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
    >
      {lines.map((_, i) => {
        const lineNum = i + 1;
        const hasErr = errorLines.has(lineNum);
        const hasWarn = warnLines.has(lineNum);

        return (
          <div key={i} className="flex items-center justify-end gap-1">
            {hasErr ? (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 inline-block" title={`Error on line ${lineNum}`} />
            ) : hasWarn ? (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 inline-block" title={`Warning on line ${lineNum}`} />
            ) : null}
            <span className={hasErr ? 'text-rose-400 font-bold' : hasWarn ? 'text-amber-400' : ''}>
              {lineNum}
            </span>
          </div>
        );
      })}
    </div>
  );
};
