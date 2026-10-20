import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Cpu, DollarSign, Info } from 'lucide-react';
import { TaskClassification } from '../../types/routing';

interface RouteBadgeProps {
  classification: TaskClassification;
  isAuto: boolean;
  onOpenLadder: () => void;
}

export const AutoRouteBadge: React.FC<RouteBadgeProps> = ({ classification, isAuto, onOpenLadder }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-slate-800 bg-slate-900/60 text-xs">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            {isAuto ? `AUTO: ${classification.selectedModelName}` : classification.selectedModelName}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
            {classification.complexityScore}/10 complexity
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:text-white text-slate-400 flex items-center gap-0.5 text-[11px]"
            title="Inspect Routing Reasoning"
          >
            <span>Why?</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={onOpenLadder}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
          >
            Change
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 space-y-2 font-mono text-[11px]">
          <div className="text-slate-300 font-sans">{classification.reasoning}</div>
          <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1 border-t border-slate-900">
            <div>Reasoning Depth: <span className="text-white capitalize">{classification.reasoningDepth}</span></div>
            <div>Security Risk: <span className="text-white capitalize">{classification.securityRisk}</span></div>
            <div>Model Rate: <span className="text-white">${classification.costPer1MInput}/1M tokens</span></div>
            <div>Cost Efficiency: <span className="text-emerald-400">{classification.estimatedSavingsPercent}% saved vs Frontier</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
