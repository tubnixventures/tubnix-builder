import path from 'path';

export function isPathSafe(workspaceRoot: string, targetPath: string): boolean {
  const resolved = path.resolve(workspaceRoot, targetPath);
  return resolved.startsWith(path.resolve(workspaceRoot));
}
