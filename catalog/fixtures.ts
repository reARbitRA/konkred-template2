/**
 * Static loader for public demo fixtures (synthetic sample data).
 * Only used for PUBLIC_DEMO product demos; never contains customer data.
 */
import contractReview from './fixtures/contract-review-sample.json';
import iacSecurity from './fixtures/iac-security-sample.json';
import incident from './fixtures/incident-sample.json';
import grcRequests from './fixtures/grc-requests-sample.json';
import reconciliation from './fixtures/reconciliation-sample.json';
import fpa from './fixtures/fpa-sample.json';
import executiveBrief from './fixtures/executive-brief-sample.json';
import seo from './fixtures/seo-sample.json';
import prd from './fixtures/prd-sample.json';
import customerHealth from './fixtures/customer-health-sample.json';
import abTest from './fixtures/ab-test-sample.json';

export const FIXTURES: Record<string, unknown> = {
  'contract-review-copilot': contractReview,
  'iac-security-copilot': iacSecurity,
  'incident-learning-postmortem': incident,
  'grc-evidence-request-triage': grcRequests,
  'reconciliation-copilot': reconciliation,
  'fpa-variance-analysis': fpa,
  'executive-flash-brief': executiveBrief,
  'seo-content-opportunity-planner': seo,
  'evidence-backed-prd-generator': prd,
  'customer-health-churn-copilot': customerHealth,
  'ab-experiment-interpretation': abTest,
};
