/**
 * Client service for the fixture-backed public demos.
 * All model execution happens server-side at POST /api/demo/run; the client
 * only sends public fixture input and receives schema-validated output in the
 * canonical DemoResponse contract (plus legacy convenience fields).
 */

export type DemoRunStatus =
  | 'COMPLETE'
  | 'NEEDS_INPUT'
  | 'BLOCKED'
  | 'INCOMPLETE_SOURCE_SET'
  | 'NEEDS_EXTERNAL_VALIDATOR'
  | 'ERROR';

export interface DemoRunResult {
  status: DemoRunStatus;
  productId: string;
  runId: string;
  sourceRefs: string[];
  result?: unknown;
  /** legacy alias of result */
  output?: unknown;
  validation?: {
    schema: 'PASS' | 'FAIL' | 'NOT_RUN';
    provenance: 'PASS' | 'FAIL' | 'NOT_RUN';
    safety: 'PASS' | 'FAIL' | 'NOT_RUN';
  };
  limitations?: string[];
  actionsExecuted?: never[];
  // legacy convenience fields still returned by the server
  productSlug?: string;
  model?: string;
  promptVersion?: string;
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
      status: 'ERROR',
      productId: slug,
      runId: 'n/a',
      sourceRefs: [],
      message: (data as { message?: string })?.message || 'Demo service unavailable.',
    };
  }
  return data as DemoRunResult;
}
