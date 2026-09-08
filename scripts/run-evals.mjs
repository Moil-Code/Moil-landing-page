#!/usr/bin/env node
/**
 * Offline eval runner. Same files as `node --test evals/*.test.js`, plus
 * a FAILED TESTS footer so a CI log tail names the failure.
 *
 * GitHub Actions is not a TTY. Without an explicit reporter, `node --test`
 * then uses TAP, which prints `ok 127 - …` for every test and ends on
 *
 *   # fail 1
 *
 * with the name hundreds of lines above. Forcing spec keeps the live
 * output; the footer reporter reprints leaf failures after the summary.
 *
 * Usage: node scripts/run-evals.mjs [files…]
 * Default files: evals/*.test.js (the package.json `test` glob).
 *
 * Spawns `node --test` rather than calling `run()`: `run()` refuses to
 * load files when NODE_TEST_CONTEXT is set (this wrapper is itself
 * spawned from evals/testFailFooter.test.js).
 */
import { spawn } from 'node:child_process';
import { globSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const reporter = path.join(here, 'evalFailFooterReporter.mjs');

function defaultFiles() {
  return globSync('evals/*.test.js', { cwd: root }).sort();
}

const extra = process.argv.slice(2);
const files = extra.length ? extra : defaultFiles();
if (!files.length) {
  console.error('[run-evals] no test files');
  process.exit(1);
}

const env = { ...process.env };
delete env.NODE_TEST_CONTEXT;

const child = spawn(
  process.execPath,
  [
    '--test',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    `--test-reporter=${reporter}`,
    '--test-reporter-destination=stdout',
    ...files,
  ],
  { cwd: root, env, stdio: 'inherit' },
);

child.on('error', (err) => {
  console.error('[run-evals]', err);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
