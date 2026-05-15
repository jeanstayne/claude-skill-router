// Phase 16.5 — Parse network requests for failures, timing, and missing resources

export interface NetworkRequestEntry {
  url: string;
  method: string;
  status: number;
  duration: number;
  size?: number;
  type: 'xhr' | 'fetch' | 'script' | 'stylesheet' | 'image' | 'font' | 'document' | 'other';
  ok: boolean;
  fromCache?: boolean;
}

export interface NetworkSummary {
  totalRequests: number;
  failed: NetworkRequestEntry[];
  slow: NetworkRequestEntry[];
  ok: NetworkRequestEntry[];
  totalSize: number;
  totalDuration: number;
  errorsByUrl: Map<string, number>;
}

const SLOW_THRESHOLD_MS = 3000;

export function parseNetworkRequests(requests: NetworkRequestEntry[]): NetworkSummary {
  const failed = requests.filter(r => !r.ok && r.status >= 400);
  const slow = requests.filter(r => r.ok && r.duration > SLOW_THRESHOLD_MS);
  const ok = requests.filter(r => r.ok && r.duration <= SLOW_THRESHOLD_MS);

  const totalSize = requests.reduce((sum, r) => sum + (r.size ?? 0), 0);
  const totalDuration = requests.reduce((sum, r) => sum + r.duration, 0);

  const errorsByUrl = new Map<string, number>();
  for (const r of failed) {
    errorsByUrl.set(r.url, (errorsByUrl.get(r.url) ?? 0) + 1);
  }

  return { totalRequests: requests.length, failed, slow, ok, totalSize, totalDuration, errorsByUrl };
}
