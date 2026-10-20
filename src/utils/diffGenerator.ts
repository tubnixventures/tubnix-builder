export function generateUnifiedDiff(file: string, oldStr: string, newStr: string): string {
  return `--- a/${file}\n+++ b/${file}\n@@ -1 +1 @@\n-${oldStr}\n+${newStr}\n`;
}
