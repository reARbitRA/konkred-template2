/**
 * fullKONK_> specialized prompt library — loader.
 * Seed: content/fullkonk/prompts/library.json (48 prompts, 12 categories × 4
 * pipeline tasks). Scale plan: owner-docs/PROMPT_FOUNDRY.md.
 */
import raw from '../content/fullkonk/prompts/library.json';

export interface LibraryPrompt {
  id: string;
  category: string;
  categoryName: string;
  task: string;
  title: string;
  body: string;
  version: string;
  updatedAt: string;
}

export interface PromptLibrary {
  manifest: {
    name: string;
    version: string;
    generatedAt: string;
    counts: { total: number; categories: number; tasks: number };
    scalePlan: string;
    envelope: string;
    integrityNote: string;
  };
  prompts: LibraryPrompt[];
}

export const PROMPT_LIBRARY = raw as unknown as PromptLibrary;
export const LIBRARY_PROMPTS: LibraryPrompt[] = PROMPT_LIBRARY.prompts;

export function getPlaybooks(): { id: string; name: string; count: number }[] {
  const map = new Map<string, { id: string; name: string; count: number }>();
  for (const p of LIBRARY_PROMPTS) {
    const cur = map.get(p.category);
    if (cur) cur.count += 1;
    else map.set(p.category, { id: p.category, name: p.categoryName, count: 1 });
  }
  return [...map.values()];
}

export function getPrompt(category: string, task = 'architect'): LibraryPrompt | undefined {
  return LIBRARY_PROMPTS.find((p) => p.category === category && p.task === task);
}

/** Compose a category playbook: architect prompt, backend standards attached. */
export function composePlaybook(category: string): string | null {
  const arch = getPrompt(category, 'architect');
  const verify = getPrompt(category, 'verify');
  if (!arch) return null;
  return [arch.body, '', verify ? `VERIFY GATE:\n${verify.body}` : ''].join('\n').trim();
}

export function searchPrompts(query: string): LibraryPrompt[] {
  const q = query.trim().toLowerCase();
  if (!q) return LIBRARY_PROMPTS;
  return LIBRARY_PROMPTS.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
}
