import { describe, it, expect } from 'vitest';
import { PROMPT_LIBRARY, LIBRARY_PROMPTS, getPlaybooks, getPrompt, composePlaybook, searchPrompts } from '../services/fullkonk.prompts';

/**
 * fullKONK_> prompt library contract.
 * Seed set: 48 prompts (12 categories × 4 pipeline tasks), assembled by
 * scripts/build-prompt-library.mjs. Foundry batches must satisfy the same law.
 */
describe('fullKONK prompt library', () => {
  it('seed manifest declares 12 categories × 4 tasks = 48 prompts', () => {
    expect(PROMPT_LIBRARY.manifest.counts.categories).toBe(12);
    expect(PROMPT_LIBRARY.manifest.counts.tasks).toBe(4);
    expect(LIBRARY_PROMPTS).toHaveLength(48);
  });

  it('ids are unique and well-formed', () => {
    const ids = LIBRARY_PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of LIBRARY_PROMPTS) {
      expect(p.id).toMatch(/^[a-z-]+:(architect|frontend|backend|verify)$/);
    }
  });

  it('every category covers all four pipeline tasks', () => {
    for (const pb of getPlaybooks()) {
      for (const task of ['architect', 'frontend', 'backend', 'verify'] as const) {
        expect(getPrompt(pb.id, task), `${pb.id}:${task}`).toBeTruthy();
      }
    }
  });

  it('every prompt is dense, concrete and envelope-compliant', () => {
    for (const p of LIBRARY_PROMPTS) {
      expect(p.body.length, `${p.id} too short`).toBeGreaterThanOrEqual(700);
      expect(p.body.length, `${p.id} too long/bloated`).toBeLessThanOrEqual(1600);
      expect(p.body).toMatch(/fullKONK_>/);
      expect(p.body).toMatch(/OUTPUT CONTRACT|typed|zod/i);
    }
  });

  it('no banned marketing claims in any prompt', () => {
    const banned = /certified|bug-free|deploy-ready|production-guaranteed|\d+% accurate/gi;
    for (const p of LIBRARY_PROMPTS) {
      expect(p.body.match(banned), `${p.id} contains a banned claim`).toBeNull();
    }
  });

  it('playbook composition returns architect + verify gate', () => {
    const pb = composePlaybook('invoicing-billing');
    expect(pb).toBeTruthy();
    expect(pb).toMatch(/ARCHITECT stage/);
    expect(pb).toMatch(/VERIFY GATE:/);
    expect(composePlaybook('no-such-category')).toBeNull();
  });

  it('search finds category prompts', () => {
    expect(searchPrompts('invoice').length).toBeGreaterThan(0);
    expect(searchPrompts('').length).toBe(48);
  });
});
