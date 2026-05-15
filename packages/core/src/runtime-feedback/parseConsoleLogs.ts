// Phase 16.5 — Parse console logs for runtime errors and warnings

export interface ConsoleLogEntry {
  type: 'error' | 'warn' | 'log' | 'info' | 'debug';
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  timestamp?: string;
}

export interface ConsoleLogSummary {
  totalErrors: number;
  totalWarnings: number;
  totalLogs: number;
  entries: ConsoleLogEntry[];
  uniqueErrors: string[];
  uniqueWarnings: string[];
}

export function parseConsoleLogs(raw: string | ConsoleLogEntry[]): ConsoleLogSummary {
  const entries = Array.isArray(raw) ? raw : parseRawText(raw);
  const errors = entries.filter(e => e.type === 'error');
  const warnings = entries.filter(e => e.type === 'warn');
  const logs = entries.filter(e => e.type === 'log' || e.type === 'info' || e.type === 'debug');

  const uniqueErrors = [...new Set(errors.map(e => e.message))];
  const uniqueWarnings = [...new Set(warnings.map(e => e.message))];

  return {
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    totalLogs: logs.length,
    entries,
    uniqueErrors,
    uniqueWarnings,
  };
}

function parseRawText(raw: string): ConsoleLogEntry[] {
  const entries: ConsoleLogEntry[] = [];
  const lines = raw.split('\n').filter(Boolean);

  for (const line of lines) {
    const entry = parseLine(line);
    if (entry) entries.push(entry);
  }

  return entries;
}

function parseLine(line: string): ConsoleLogEntry | null {
  // Chrome-style: "ERROR [source:line:col] message"
  const chromeRe = /^(ERROR|WARN|WARNING|INFO|LOG|DEBUG)\s*(?:\[([^\]]+)\])?\s*(.*)/i;
  const match = line.match(chromeRe);
  if (!match) return null;

  const rawType = match[1].toLowerCase();
  const sourceInfo = match[2] ?? '';
  const message = match[3] ?? '';

  const normalizedType: ConsoleLogEntry['type'] = (rawType === 'warning' || rawType === 'warn') ? 'warn'
    : rawType === 'error' ? 'error'
    : rawType === 'log' ? 'log'
    : rawType === 'info' ? 'info'
    : rawType === 'debug' ? 'debug'
    : 'log';
  const entry: ConsoleLogEntry = { type: normalizedType, message };

  if (sourceInfo) {
    const parts = sourceInfo.split(':');
    entry.source = parts[0];
    if (parts[1]) entry.line = parseInt(parts[1], 10);
    if (parts[2]) entry.column = parseInt(parts[2], 10);
  }

  return entry;
}
