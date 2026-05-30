const API_BASE = process.env.NEXT_PUBLIC_DASHBOARD_API || 'http://localhost:4002';

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export type LiveSignal = {
  id: string;
  userId: string;
  signalName: string;
  pageUrl: string;
  device: string;
  timestamp: string;
};

export type ScenarioFirings = {
  hourly: Array<{ time: string; S1: number; S2: number }>;
};

export type AbResults = {
  control: { count: number; converted: number; cr: number };
  treatment: { count: number; converted: number; cr: number };
  p_value: number;
  significant: boolean;
};

export type SignalsCoverage = {
  total_signals: number;
  collected: number[];
  coverage_percent: number;
};

export async function fetchLiveSignals(fallback: LiveSignal[]) {
  return getJson<LiveSignal[]>('/stream/live', fallback);
}

export async function fetchScenarioFirings(fallback: ScenarioFirings) {
  const now = Date.now();
  const from = now - 24 * 60 * 60 * 1000;
  return getJson<ScenarioFirings>(`/scenarios/firings?from=${from}&to=${now}`, fallback);
}

export async function fetchAbResults(fallback: AbResults) {
  return getJson<AbResults>('/ab/results?scenario=S1', fallback);
}

export async function fetchSignalsCoverage(fallback: SignalsCoverage) {
  return getJson<SignalsCoverage>('/signals/coverage', fallback);
}
