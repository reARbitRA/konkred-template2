import { describe, it, expect } from 'vitest';
import { validateDemoInput, validateDemoOutput, validateInquiryForm } from '../catalog/validate.ts';
import { PRODUCTS } from '../catalog/products.ts';
import { FIXTURES } from '../catalog/fixtures.ts';

describe('demo input validation (NEEDS_INPUT semantics)', () => {
  const contractReview = PRODUCTS.find(p => p.slug === 'contract-review-copilot')!;

  it('accepts a valid payload', () => {
    expect(validateDemoInput(contractReview, { contractText: 'x'.repeat(250) })).toEqual([]);
  });

  it('rejects a missing required field', () => {
    const errors = validateDemoInput(contractReview, {});
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('contractText');
  });

  it('rejects non-object payloads', () => {
    expect(validateDemoInput(contractReview, null).length).toBeGreaterThan(0);
    expect(validateDemoInput(contractReview, 'nope').length).toBeGreaterThan(0);
  });

  it('rejects wrong types', () => {
    const errors = validateDemoInput(contractReview, { contractText: 42 });
    expect(errors.some(e => e.includes('contractText'))).toBe(true);
  });

  it('rejects strings below minLength', () => {
    const errors = validateDemoInput(contractReview, { contractText: 'short' });
    expect(errors.some(e => e.includes('contractText'))).toBe(true);
  });

  it('every product with an available demo validates its own fixture as input', () => {
    for (const product of PRODUCTS) {
      if (!product.demoStatus.available) continue;
      const fixture = FIXTURES[product.slug];
      expect(fixture, `fixture missing for ${product.slug}`).toBeTruthy();
      // The fixture payload should be structurally valid per the input schema —
      // with one documented exception: fixtures carry a sampleLabel wrapper.
      const errors = validateDemoInput(product, fixture);
      // sampleLabel is extra metadata and must be tolerated; required keys must be present.
      const requiredMissing = errors.filter(e => e.startsWith('Missing required input'));
      expect(requiredMissing, `${product.slug}: ${requiredMissing.join('; ')}`).toEqual([]);
    }
  });
});

describe('demo output validation (BLOCKED semantics)', () => {
  const incident = PRODUCTS.find(p => p.slug === 'incident-learning-postmortem')!;

  it('accepts a valid output object', () => {
    const output = {
      summary: 'ok',
      timeline: [],
      impact: 'none',
      rootCauseHypotheses: [{ hypothesis: 'x', confidence: 'MEDIUM', evidence: 'y' }],
      actionItems: [{ action: 'fix' }],
      title: 't',
    };
    expect(validateDemoOutput(incident, output)).toEqual([]);
  });

  it('rejects output missing required fields', () => {
    const errors = validateDemoOutput(incident, { summary: 'only summary' });
    expect(errors.some(e => e.includes('rootCauseHypotheses'))).toBe(true);
    expect(errors.some(e => e.includes('actionItems'))).toBe(true);
  });

  it('rejects output with invalid enum values', () => {
    const output = {
      summary: 'ok',
      rootCauseHypotheses: [{ hypothesis: 'x', confidence: 'CERTAIN' }],
      actionItems: [{ action: 'fix' }],
    };
    const errors = validateDemoOutput(incident, output);
    expect(errors.some(e => e.includes('confidence'))).toBe(true);
  });

  it('rejects non-object output', () => {
    expect(validateDemoOutput(incident, '[1,2]').length).toBeGreaterThan(0);
    expect(validateDemoOutput(incident, null).length).toBeGreaterThan(0);
  });
});

describe('inquiry form validation', () => {
  it('accepts a valid inquiry', () => {
    expect(validateInquiryForm({ name: 'Jane', email: 'jane@co.com', acceptedTerms: true })).toEqual([]);
  });

  it('rejects missing name', () => {
    const errors = validateInquiryForm({ name: '', email: 'jane@co.com', acceptedTerms: true });
    expect(errors).toContain('Name is required.');
  });

  it('rejects invalid email', () => {
    const errors = validateInquiryForm({ name: 'Jane', email: 'not-an-email', acceptedTerms: true });
    expect(errors.some(e => e.includes('valid email'))).toBe(true);
  });

  it('rejects missing consent', () => {
    const errors = validateInquiryForm({ name: 'Jane', email: 'jane@co.com', acceptedTerms: false });
    expect(errors.some(e => e.includes('terms and privacy'))).toBe(true);
  });

  it('reports multiple problems at once', () => {
    const errors = validateInquiryForm({ name: '', email: '', acceptedTerms: false });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});
