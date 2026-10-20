export interface CodeDiagnostic {
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule?: string;
}
