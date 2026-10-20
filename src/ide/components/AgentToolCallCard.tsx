import React, { useState } from 'react';
import { Terminal, FileCode, Search, CheckCircle2, XCircle, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { AgentToolCall } from '../types/agentTools';

export const AgentToolCallCard: React.FC<{ tool: AgentToolCall }> = ({ tool }) => {
  const [expanded, setExpanded] = useState(false);
  const isTerm = tool.tool === 'run_command';
  const isSearch = tool.tool === 'search_codebase';
  const isFile = tool.tool === 'write_file' || tool.tool === 'read_file' || tool.tool === 'edit_file';

  const toolTitle = isTerm
    ? `$ ${tool.params.command || ''}`
    : isSearch
    ? `grep "${tool.params.query || ''}"`
    : `${tool.tool.replace('_', ' ')} ${tool.params.path || ''}`;

  return (
    <div className="rounded border border-slate-800 bg-slate-950/80 font-mono text-[11px] overflow-hidden my-1">
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-2.5 py-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 select-none text-slate-300"
      >
        <div className="flex items-center gap-2 truncate">
          {isTerm && <Terminal className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
          {isSearch && <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
          {isFile && <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          <span className="truncate font-semibold">{toolTitle}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-500">
          {tool.durationMs !== undefined && (
            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{tool.durationMs}ms</span>
          )}
          {tool.status === 'success' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <XCircle className="w-3 h-3 text-rose-400" />
          )}
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </div>
      </div>

      {expanded && (
        <div className="p-2 border-t border-slate-900 bg-slate-950 text-slate-400 text-[10px] select-text">
          {tool.output && (
            <pre className="whitespace-pre-wrap font-mono max-h-32 overflow-y-auto pl-2 border-l border-slate-800 text-slate-300">
              {tool.output}
            </pre>
          )}
          {tool.error && (
            <div className="text-rose-400 font-semibold">{tool.error}</div>
          )}
        </div>
      )}
    </div>
  );
};
