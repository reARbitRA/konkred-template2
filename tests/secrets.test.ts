import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

/**
 * No-secret-leakage guard:
 * - Server secrets must never appear in client code.
 * - Client bundles must not contain server secret names with values.
 * - No credential files are tracked in git.
 */
const ROOT = process.cwd();

const CLIENT_SOURCE_DIRS = ['App.tsx', 'pages', 'components', 'contexts', 'hooks', 'utils', 'services', 'catalog'];

describe('no secret leakage', () => {
  it('client-side source never reads server env secrets', () => {
    const clientSource = collectClientSource();
    // GEMINI_API_KEY / provider keys must only be referenced server-side.
    // services/ai.ts and fullkonk files talk to the proxy; they must not read process.env.
    const offenders: string[] = [];
    for (const m of clientSource.matchAll(/process\.env\.([A-Z_]+)/g)) {
      if (!['VITE_', 'NODE_ENV'].some(prefix => m[1].startsWith(prefix))) {
        offenders.push(m[1]);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('no .env (or credential files) are tracked by git — .env.example is allowed', () => {
    const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n');
    const bad = tracked.filter(f => {
      const base = f.split('/').pop() || f;
      if (base === '.env.example') return false; // documented template, no values
      return /^\.env(\.|$)/.test(base) || base === '.netrc' || base === '.git-credentials';
    });
    expect(bad).toEqual([]);
  });

  it('repository files do not contain live provider key patterns', () => {
    const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
    const suspicious: string[] = [];
    for (const file of tracked) {
      if (/\.(cjs|map|lock|json)$/.test(file)) continue;
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      if (/(sk-[A-Za-z0-9]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(content)) {
        suspicious.push(file);
      }
    }
    expect(suspicious).toEqual([]);
  });
});

function collectClientSource(): string {
  let out = '';
  for (const entry of CLIENT_SOURCE_DIRS) {
    const p = path.join(ROOT, entry);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) {
      walk(p, file => { out += fs.readFileSync(file, 'utf8') + '\n'; });
    } else {
      out += fs.readFileSync(p, 'utf8') + '\n';
    }
  }
  return out;
}

function walk(dir: string, cb: (file: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (/\.(ts|tsx)$/.test(entry.name)) cb(full);
  }
}
