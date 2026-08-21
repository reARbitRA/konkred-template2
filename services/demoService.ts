/**
 * Client service for the fixture-backed public demos.
 * All model execution happens server-side at POST /api/demo/run; the client
 * only sends public fixture input and receives schema-validated output.
 */

export type DemoRunStatus =
  | 'ok'
  | 'blocked'
  | 'needs_input'
  | 'request_pilot'
  | 'error';

export interface DemoRunResult {
  status: DemoRunStatus;
  productSlug: string;
  runId?: string;
  model?: string;
  promptVersion?: string;
  output?: unknown;
  message?: string;
  validationErrors?: string[];
  demoNotice?: string;
}

export async function runProductDemo(slug: string, input: unknown): Promise<DemoRunResult> {
  const response = await fetch('/api/demo/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, input }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      status: 'error',
      productSlug: slug,
      message: data?.error || 'Demo service unavailable.',
    };
  }
  return data as DemoRunResult;
}
