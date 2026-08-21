/**
 * CI runner for the portfolio manifest validator.
 * Usage: node scripts/validate-portfolio.mjs   (exit 1 on any violation)
 */
import { readFileSync, existsSync } from 'node:fs';
import { validatePortfolio } from '../content/catalogue/validate.ts';

const manifest = JSON.parse(readFileSync('content/catalogue/portfolio-36.json', 'utf8'));
const result = validatePortfolio(manifest, (p) => existsSync(p));

if (!result.ok) {
  console.error(`portfolio manifest INVALID — ${result.errors.length} error(s):`);
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`portfolio manifest VALID — ${manifest.entries.length} entries (21 suites + 15 workflows), ids/slugs/routes unique, parents resolve, validators linked, no autonomous actions.`);
