import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { fetchLiveCloudflareModels } from '../services/cloudflareModelFetcher';

interface CloudflareTabProps {
  accountId: string;
  apiToken: string;
  onSaveCredentials: (acc: string, tok: string) => void;
  onModelsFetched?: (modelsCount: number) => void;
}

export const CloudflareSettingsTab: React.FC<CloudflareTabProps> = ({
  accountId,
  apiToken,
  onSaveCredentials,
  onModelsFetched,
}) => {
  const [accInput, setAccInput] = useState(accountId);
  const [tokInput, setTokInput] = useState(apiToken);
  const [status, setStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestAndSync = async () => {
    setIsTesting(true);
    setStatus(null);
    onSaveCredentials(accInput.trim(), tokInput.trim());

    try {
      const res = await fetchLiveCloudflareModels(accInput.trim(), tokInput.trim());
      if (res.success) {
        setStatus(`✔ Connected: ${res.models.length} dynamic models verified.`);
        onModelsFetched?.(res.models.length);
      } else {
        setStatus(`Notice: ${res.error}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div>
        <label className="block text-slate-300 text-[11px] mb-1">Cloudflare Account ID (Required)</label>
        <input
          type="text"
          value={accInput}
          onChange={(e) => setAccInput(e.target.value)}
          placeholder="e.g. 0123456789abcdef0123456789abcdef"
          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white outline-none focus:border-orange-500 text-xs"
        />
      </div>

      <div>
        <label className="block text-slate-300 text-[11px] mb-1">Cloudflare API Token (Required, SecretStorage)</label>
        <input
          type="password"
          value={tokInput}
          onChange={(e) => setTokInput(e.target.value)}
          placeholder="••••••••••••••••••••••••••••••••"
          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white outline-none focus:border-orange-500 text-xs"
        />
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={handleTestAndSync}
          disabled={isTesting}
          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-[11px] flex items-center gap-1.5 disabled:opacity-50 font-sans font-medium"
        >
          {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>Verify &amp; Consult Cloudflare Models</span>
        </button>
      </div>

      {status && (
        <div className={`p-2 rounded text-[11px] ${status.startsWith('✔') ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border border-slate-700 text-slate-300'}`}>
          {status}
        </div>
      )}
    </div>
  );
};
