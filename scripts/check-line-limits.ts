import fs from 'fs';
import path from 'path';

interface LineCheckResult {
  file: string;
  lines: number;
  passed: boolean;
}

const MAX_LINES = 100;
const DIRECTORIES = ['src', 'tests', 'scripts'];
const EXTENSIONS = ['.ts', '.tsx', '.js'];

export function countFileLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

export function scanDirectory(
  dir: string,
  results: LineCheckResult[] = []
): LineCheckResult[] {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        scanDirectory(fullPath, results);
      }
    } else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      const lines = countFileLines(fullPath);
      results.push({
        file: fullPath,
        lines,
        passed: lines <= MAX_LINES,
      });
    }
  }
  return results;
}

export function runLineLimitCheck(): {
  total: number;
  failed: LineCheckResult[];
  results: LineCheckResult[];
} {
  const results: LineCheckResult[] = [];
  for (const dir of DIRECTORIES) {
    scanDirectory(path.resolve(process.cwd(), dir), results);
  }
  const failed = results.filter((r) => !r.passed);
  return { total: results.length, failed, results };
}

if (process.argv[1] && process.argv[1].includes('check-line-limits')) {
  const { total, failed } = runLineLimitCheck();
  console.log(`Checked ${total} source files for max ${MAX_LINES} lines:`);
  if (failed.length > 0) {
    console.error(`FAILED: ${failed.length} file(s) exceeded ${MAX_LINES} lines:`);
    for (const f of failed) {
      console.error(`  - ${f.file}: ${f.lines} lines`);
    }
    process.exit(1);
  } else {
    console.log(`PASS: All ${total} files are within the ${MAX_LINES}-line limit.`);
  }
}
