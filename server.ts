import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 3000;
const APP_DIR = process.cwd();

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post('/api/terminal/exec', (req, res) => {
    const { command, shell } = req.body || {};
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command string is required.' });
    }

    const trimmed = command.trim();
    let cmdToRun = trimmed;

    // Auto-compat for npm install without conflicting peer dependency failure
    if (trimmed.startsWith('npm i ') || trimmed.startsWith('npm install ')) {
      if (!trimmed.includes('--legacy-peer-deps') && !trimmed.includes('--force')) {
        cmdToRun = `${trimmed} --legacy-peer-deps`;
      }
    }

    if (shell === 'pwsh' && trimmed.toLowerCase().startsWith('get-')) {
      if (trimmed.toLowerCase() === 'get-childitem') cmdToRun = 'ls -la';
      else if (trimmed.toLowerCase() === 'get-location') cmdToRun = 'pwd';
      else if (trimmed.toLowerCase() === 'get-process') cmdToRun = 'ps aux | head -n 15';
    }

    const timeout = trimmed.startsWith('npm') ? 120000 : 30000;
    exec(cmdToRun, { cwd: APP_DIR, timeout, maxBuffer: 1024 * 1024 * 8 }, (error, stdout, stderr) => {
      const output = (stdout || '') + (stderr ? (stdout ? '\n' : '') + stderr : '');
      return res.json({
        command: trimmed,
        output: output.trim() || `Process finished (exit code ${error ? error.code || 1 : 0})`,
        exitCode: error ? error.code || 1 : 0,
        stdout,
        stderr,
      });
    });
  });

  app.get('/api/terminal/packages', (_req, res) => {
    try {
      const pkgPath = path.join(APP_DIR, 'package.json');
      const data = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return res.json({ dependencies: data.dependencies || {}, devDependencies: data.devDependencies || {} });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  if (isDev) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(APP_DIR, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(APP_DIR, 'dist', 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack IDE Server] Listening on http://0.0.0.0:${PORT} (mode: ${isDev ? 'dev' : 'prod'})`);
  });
}

startServer().catch((err) => {
  console.error('[Full-Stack IDE Server] Startup failed:', err);
  process.exit(1);
});
