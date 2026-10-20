import { SupportedLanguage } from '../types/ide';

const SNIPPETS: Record<SupportedLanguage, string[]> = {
  typescript: [
    'interface Props {\n  title: string;\n}',
    'export const handler = async (req: Request) => {\n  return Response.json({ ok: true });\n};',
    'function calculateMetric(data: number[]): number {\n  return data.reduce((a, b) => a + b, 0);\n}',
  ],
  javascript: [
    'export default function init() {\n  console.log("App ready");\n}',
    'const debounce = (fn, ms = 300) => {\n  let t;\n  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };\n};',
  ],
  python: [
    'def main():\n    print("System active")\n\nif __name__ == "__main__":\n    main()',
    'async def fetch_records(session, url):\n    async with session.get(url) as resp:\n        return await resp.json()',
  ],
  html: ['<div className="flex items-center justify-between p-4">\n  <span>Content</span>\n</div>'],
  css: ['.editor-container {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}'],
  json: ['{\n  "version": "1.0.0",\n  "status": "ready"\n}'],
  markdown: ['## Overview\n\nThis document describes the VS Code AI runtime architecture.'],
  rust: ['fn main() {\n    println!("Rust microservice loaded");\n}'],
  go: ['package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Ready")\n}'],
  shell: ['#!/usr/bin/env bash\nset -euo pipefail\necho "Running build..."'],
  sql: ['SELECT id, name, created_at FROM workspaces ORDER BY created_at DESC LIMIT 10;'],
  plaintext: ['// Pure text notes and workspace diagnostics'],
};

export function getInlineGhostSuggestion(
  currentCode: string,
  language: SupportedLanguage
): string | null {
  if (!currentCode.trim()) return null;
  const list = SNIPPETS[language] || SNIPPETS.typescript;
  const lastLine = currentCode.split('\n').pop()?.trim() || '';
  if (lastLine.length < 3) return null;
  const match = list.find((s) => s.toLowerCase().includes(lastLine.toLowerCase()));
  return match || list[0];
}

export function getInlineSuggestion(lang: SupportedLanguage, _fileName?: string): string {
  const list = SNIPPETS[lang] || SNIPPETS.typescript;
  return list[0] || '// Suggested snippet';
}
