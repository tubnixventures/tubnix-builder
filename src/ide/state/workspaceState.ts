import { WorkspaceFile, EditorSettings } from '../types/ide';

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  fontSize: 13,
  fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
  theme: 'dark-modern',
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  showMinimap: false,
  autoSave: true,
  showLineNumbers: true,
  inlineAiEnabled: true,
};

export const INITIAL_WORKSPACE_FILES: WorkspaceFile[] = [
  {
    id: 'dir-src',
    name: 'src',
    path: 'src',
    content: '',
    isFolder: true,
    isOpen: true,
    children: [
      {
        id: 'file-app-vue',
        name: 'App.vue',
        path: 'src/App.vue',
        content: `<template>\n  <div class="desktop-agent-app">\n    <header class="app-header">\n      <h2>Cloudflare AI Desktop Agent</h2>\n      <span class="status-indicator">Connected</span>\n    </header>\n    <router-view />\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue';\nconst isRunning = ref(true);\n</script>`,
        isFolder: false,
      },
      {
        id: 'file-agent-ts',
        name: 'agent.ts',
        path: 'src/agent.ts',
        content: `export interface AgentTask {\n  id: string;\n  prompt: string;\n  tier: 'tier1_low_cost' | 'tier2_intermediate' | 'tier3_frontier';\n}\n\nexport async function executeTask(task: AgentTask): Promise<void> {\n  console.log(\`[Agent] Executing \${task.id} on \${task.tier}\`);\n}`,
        isFolder: false,
      },
      {
        id: 'file-styles-css',
        name: 'styles.css',
        path: 'src/styles.css',
        content: `:root {\n  --bg-primary: #0a0d14;\n  --text-primary: #f8fafc;\n  --accent: #f97316;\n}\n\nbody {\n  margin: 0;\n  background: var(--bg-primary);\n  font-family: system-ui, sans-serif;\n}`,
        isFolder: false,
      },
    ],
  },
  {
    id: 'file-api-py',
    name: 'server.py',
    path: 'server.py',
    content: `from http.server import HTTPServer, BaseHTTPRequestHandler\n\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        self.send_response(200)\n        self.end_headers()\n        self.wfile.write(b"AI Agent Desktop Backend Active")\n\nif __name__ == "__main__":\n    HTTPServer(("", 8000), Handler).serve_forever()`,
    isFolder: false,
  },
  {
    id: 'file-pkg',
    name: 'package.json',
    path: 'package.json',
    content: `{\n  "name": "desktop-ai-ide",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vue-tsc && vite build"\n  }\n}`,
    isFolder: false,
  },
];
