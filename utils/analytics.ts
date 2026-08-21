/**
 * Privacy-safe product analytics.
 * Events carry no personal data, no input content and no credentials —
 * event names plus anonymous counters only. Buffered in memory; a real
 * sink can be attached later without changing call sites.
 */
export type AnalyticsEvent =
  | 'catalogue_view'
  | 'suite_view'
  | 'workflow_view'
  | 'demo_start'
  | 'demo_complete'
  | 'validation_view'
  | 'kit_cta_click'
  | 'sprint_request'
  | 'controlled_pilot_request'
  | 'enterprise_request'
  | 'checkout_start'
  | 'checkout_success';

const buffer: { event: AnalyticsEvent; at: string; productId?: string }[] = [];

export function track(event: AnalyticsEvent, productId?: string): void {
  const record = { event, at: new Date().toISOString(), productId };
  buffer.push(record);
  if (buffer.length > 200) buffer.shift();
  if (typeof window !== 'undefined' && (window as unknown as { __konkredAnalyticsSink?: unknown }).__konkredAnalyticsSink) {
    (window as unknown as { __konkredAnalyticsSink: (r: unknown) => void }).__konkredAnalyticsSink(record);
  }
}

export function getAnalyticsBuffer() {
  return [...buffer];
}
