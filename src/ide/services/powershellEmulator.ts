import { WorkspaceFile } from '../types/ide';

export function runPowerShellCommand(
  cmd: string,
  files: WorkspaceFile[]
): { handled: boolean; output: string } {
  const trimmed = cmd.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'get-childitem' || lower === 'dir' || lower === 'gci') {
    const header = `\n    Directory: /app/applet\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----`;
    const rows = files.map((f) => {
      const mode = f.isFolder ? 'd-----' : '-a----';
      const time = new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
      const len = f.isFolder ? '' : (f.content?.length || 1024).toString().padStart(12);
      return `${mode}         ${time.padEnd(20)} ${len} ${f.name}`;
    });
    return { handled: true, output: `${header}\n${rows.join('\n')}\n` };
  }

  if (lower === 'get-location' || lower === 'gl' || lower === 'pwd') {
    return { handled: true, output: `\nPath\n----\n/app/applet\n` };
  }

  if (lower === 'get-process' || lower === 'gps') {
    return {
      handled: true,
      output: `\n NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName\n ------    -----      -----     ------      --  -- -----------\n     14    45.20      92.10       1.45      40   1 node (dev-server)\n      8    12.30      26.50       0.52       6   1 control-plane-api\n     10    22.10      48.00       0.88      27   1 tsx runner\n`,
    };
  }

  if (lower.startsWith('get-content ') || lower.startsWith('gc ') || lower.startsWith('type ')) {
    const filename = trimmed.split(' ').slice(1).join(' ').replace(/['"]/g, '');
    const found = files.find((f) => f.name.toLowerCase() === filename.toLowerCase());
    if (found && found.content) {
      return { handled: true, output: found.content };
    }
    return { handled: true, output: `Get-Content: Cannot find path '${filename}' because it does not exist.` };
  }

  if (lower === 'clear-host' || lower === 'cls') {
    return { handled: true, output: '__CLEAR__' };
  }

  if (lower === '$psversiontable' || lower === 'get-host') {
    return {
      handled: true,
      output: `\nName                           Value\n----                           -----\nPSVersion                      7.4.2\nPSEdition                      Core\nGitCommitId                    7.4.2\nOS                             Linux 6.6.0-generic\nPlatform                       Unix\nWSManStackVersion              3.0\nPSCompatibleVersions           {1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0...}\n`,
    };
  }

  return { handled: false, output: '' };
}
