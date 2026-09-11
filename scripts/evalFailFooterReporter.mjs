/**
 * Spec-composing reporter that reprints leaf failures after the summary.
 *
 * Used by scripts/run-evals.mjs as a second --test-reporter so a CI tail
 * (GitHub Actions is not a TTY; TAP would bury the name above `# fail N`)
 * still lists the failed test and file:line.
 *
 * Yields nothing until the event stream ends, so spec's live output is
 * not replaced — only appended to.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function leafFailures(events) {
  return events.filter((e) => e?.details?.type !== 'suite' && e?.details?.error?.failureType !== 'subtestsFailed');
}

export function formatFailFooter(failures, rootDir = root) {
  const lines = ['', '========== FAILED TESTS =========='];
  for (const f of failures) {
    const file = f.file ? (path.isAbsolute(f.file) ? path.relative(rootDir, f.file) || f.file : f.file) : '';
    const loc = file && f.line ? `${file}:${f.line}` : file;
    lines.push(loc ? `  ${f.name}  (${loc})` : `  ${f.name}`);
  }
  lines.push('==================================', '');
  return lines.join('\n');
}

export default async function* evalFailFooterReporter(source) {
  const collected = [];
  for await (const event of source) {
    if (event.type === 'test:fail') collected.push(event.data);
  }
  const listed = leafFailures(collected);
  if (listed.length) yield formatFailFooter(listed);
}
