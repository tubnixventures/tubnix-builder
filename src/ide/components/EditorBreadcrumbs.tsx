import React from 'react';
import { ChevronRight, FileCode, ArrowUpRight } from 'lucide-react';
import { WorkspaceFile } from '../types/ide';
import { extractImportSpecifiers, resolveImportPath } from '../services/importLinkResolver';
import { extractFileSymbols } from '../services/symbolExtractor';

interface BreadcrumbsProps {
  activeFile?: WorkspaceFile;
  content: string;
  allFiles: WorkspaceFile[];
  onOpenTargetFile: (file: WorkspaceFile) => void;
}

export const EditorBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeFile,
  content,
  allFiles,
  onOpenTargetFile,
}) => {
  if (!activeFile) return null;

  const pathParts = activeFile.path.split('/');
  const symbols = extractFileSymbols(content);
  const imports = extractImportSpecifiers(content);

  const handleImportClick = (specifier: string) => {
    const target = resolveImportPath(activeFile.path, specifier, allFiles);
    if (target) onOpenTargetFile(target);
  };

  return (
    <div className="h-7 bg-slate-950/90 border-b border-slate-800/60 px-3 flex items-center justify-between font-mono text-[11px] text-slate-500 select-none">
      <div className="flex items-center gap-1 truncate">
        {pathParts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
            <span className={i === pathParts.length - 1 ? 'text-slate-300 font-medium' : 'text-slate-500 hover:text-slate-400'}>
              {part}
            </span>
          </React.Fragment>
        ))}

        {symbols.length > 0 && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-orange-400/90 text-[10px] truncate">
              {symbols[0].kind} {symbols[0].name}
            </span>
          </>
        )}
      </div>

      {imports.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-slate-600">Links:</span>
          {imports.slice(0, 3).map((imp, idx) => (
            <button
              key={idx}
              onClick={() => handleImportClick(imp)}
              className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 flex items-center gap-0.5 transition-colors"
              title={`Go to definition / Open imported file '${imp}'`}
            >
              <span>{imp.split('/').pop()}</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
