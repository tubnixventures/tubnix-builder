import { SupportedLanguage } from '../types/ide';

export function getFileLanguage(fileName: string): SupportedLanguage {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
    case 'mjs':
      return 'javascript';
    case 'py':
      return 'python';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'rs':
      return 'rust';
    case 'go':
      return 'go';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'sql':
      return 'sql';
    default:
      return 'plaintext';
  }
}

export function getLanguageColor(lang: SupportedLanguage): string {
  switch (lang) {
    case 'typescript':
      return 'text-blue-400';
    case 'javascript':
      return 'text-yellow-400';
    case 'python':
      return 'text-emerald-400';
    case 'html':
      return 'text-orange-400';
    case 'css':
      return 'text-sky-400';
    case 'json':
      return 'text-amber-400';
    case 'markdown':
      return 'text-indigo-400';
    case 'rust':
      return 'text-red-400';
    case 'go':
      return 'text-cyan-400';
    case 'shell':
      return 'text-green-400';
    case 'sql':
      return 'text-purple-400';
    case 'plaintext':
    default:
      return 'text-slate-400';
  }
}
