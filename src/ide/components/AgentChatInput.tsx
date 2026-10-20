import React, { useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { AgentQuickPrompts } from './AgentQuickPrompts';

interface InputProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  onSend: (text?: string) => void;
  onUploadFile?: (file: { name: string; content: string }) => void;
}

export const AgentChatInput: React.FC<InputProps> = ({
  input,
  setInput,
  isLoading,
  onSend,
  onUploadFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onUploadFile?.({ name: file.name, content: text || '' });
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div className="p-2 border-t border-slate-800 bg-slate-950 space-y-2">
      <AgentQuickPrompts onSelect={(q) => onSend(q)} />
      <div className="flex gap-1.5 items-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded"
          title="Upload file to chat context"
        >
          <Paperclip className="w-3.5 h-3.5 text-orange-400" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask agent, e.g. 'refactor this component'..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono"
        />
        <button onClick={() => onSend()} disabled={isLoading || !input.trim()} className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded disabled:opacity-40">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
