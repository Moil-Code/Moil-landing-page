#!/usr/bin/env node
/**
 * page-dates — when did each indexable page last REALLY change?
 *
 * Plan 8.4 (F12). app/sitemap.ts used to stamp `lastModified: today` on every
 * URL at every build, and app/business/layout.tsx hand-typed a dateModified
 * that was stale the week after it was written. Google documents that a
 * lastmod which is not consistently accurate is ignored, and the blog's own
 * seo-audit fails the build on exactly that shape ("every URL shares one
 * lastmod"). This script derives each route's date from git and writes
 * src/common/seo/pageDates.json; the sitemap and the Article schema read it.
 *
 * A route's date is the NEWEST commit touching any of: the route's own
 * directory, the non-page files of its route group (aeoLocks.ts, AeoCitePage
 * for /compare/*), the translation tables and the shared SEO copy — a page
 * whose words live in the translation table changed when the table did.
 *
 * It runs as `prebuild`. Two refusals keep it honest:
 *   - A SHALLOW checkout (or one with almost no history) makes every route
 *     share the clone's commit date — the defect this fixes wearing a
 *     different costume. The script then leaves the COMMITTED file alone and
 *     says so; the committed dates lag, which is far better than "today".
 *   - `--check` exits non-zero when the committed file differs from what git
 *     says now (for a human, before committing; CI fetches full history).
 *
 * Usage: node scripts/page-dates.mjs [--check] [--quiet]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT = path.join(root, 'src/common/seo/pageDates.json');
const OUT_PATHSPEC = ':(exclude)src/common/seo/pageDates.json';
const args = new Set(process.argv.slice(2));
const log = (...a) => { if (!args.has('--quiet')) console.log('[page-dates]', ...a); };

function git(...argv) {
  return execFileSync('git', argv, { cwd: root, encoding: 'utf8' }).trim();
}

// Indexable routes = every app/**/page.tsx, minus what robots.txt disallows or
// the sitemap deliberately omits. Keep this exclusion list in step with
// app/robots.ts and app/sitemap.ts; the eval asserts every sitemap route has
// a date, so a route missing here fails the build rather than reading "today".
// `/plan/preview` is the magnet door (noindex, canonical /business) — a
// filesystem GET so the Next rewrite cannot 404 the Business Plan API.
const EXCLUDED = new Set(['/legacy', '/login', '/register', '/plan/preview']);
const DIR_OF = new Map();
function routes() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'page.tsx') {
        const rel = path.relative(path.join(root, 'app'), path.dirname(p)).split(path.sep).join('/');
        // A route GROUP segment — app/es/(guias)/x — is a filesystem folder and
        // not a URL segment; the served route is /es/x. Keyed on the URL so the
        // sitemap's dateFor(route) finds it, with the real directory kept beside.
        const urlRel = rel.split('/').filter((seg) => !/^\(.*\)$/.test(seg)).join('/');
        const route = urlRel === '' ? '/' : `/${urlRel}`;
        if (!EXCLUDED.has(route) && !route.includes('[')) { out.push(route); DIR_OF.set(route, rel === '' ? 'app' : `app/${rel}`); }
      }
    }
  };
  walk(path.join(root, 'app'));
  return out.sort();
}

// Shared sources count for a route ONLY when something in that route reads
// them — a legal page that imports neither the translation tables nor the
// SEO copy did not change when those did. Attributing every shared edit to
// every route is how all thirty routes end up sharing one date, which is the
// "lastModified: today" defect with extra steps.
const SHARED = [
  { dir: 'src/common/translations', importRe: /common\/translations/ },
  { dir: 'src/common/seo', importRe: /common\/seo\// },
  { dir: 'src/common/data', importRe: /common\/data\// },
];
function sourcesFor(route) {
  const dir = DIR_OF.get(route) ?? (route === '/' ? 'app' : `app${route}`);
  const own = [dir];
  // Route-group siblings (e.g. app/compare/aeoLocks.ts) change the page too.
  const group = path.dirname(dir);
  if (group !== 'app' && group !== '.') {
    for (const e of fs.readdirSync(path.join(root, group), { withFileTypes: true })) {
      if (e.isFile()) own.push(path.join(group, e.name));
    }
  }
  const ownText = own
    .flatMap((p) => {
      const abs = path.join(root, p);
      if (!fs.existsSync(abs)) return [];
      if (fs.statSync(abs).isFile()) return [abs];
      const files = [];
      const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name); if (e.isDirectory()) walk(q); else if (/\.(ts|tsx)$/.test(e.name)) files.push(q); } };
      walk(abs);
      return files;
    })
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n');
  const shared = SHARED.filter((s) => s.importRe.test(ownText)).map((s) => s.dir);
  return [...own, ...shared].filter((p) => fs.existsSync(path.join(root, p)));
}

function lastChange(paths) {
  // The output lives under src/common/seo, one of the shared source trees.
  // Excluding it prevents a commit of this generated file from changing the
  // result and making that same file stale immediately after the push.
  const iso = git('log', '-1', '--format=%cI', '--', ...paths, OUT_PATHSPEC);
  return iso ? iso.slice(0, 10) : null;
}

function hasWorkingTreeChange(paths) {
  return Boolean(git(
    'status',
    '--porcelain',
    '--untracked-files=all',
    '--',
    ...paths,
    OUT_PATHSPEC,
  ));
}

function main() {
  const shallow = git('rev-parse', '--is-shallow-repository') === 'true';
  const depth = Number(git('rev-list', '--count', 'HEAD'));
  if (shallow || depth < 20) {
    log(`REFUSING to derive dates: ${shallow ? 'shallow checkout' : `only ${depth} commits`} — every route would share one date. Keeping the committed pageDates.json.`);
    if (!fs.existsSync(OUT)) { console.error('[page-dates] no committed pageDates.json to fall back on'); process.exit(1); }
    return;
  }
  const dates = {};
  for (const route of routes()) {
    const sources = sourcesFor(route);
    // Predict the date of the commit being prepared. Without this, an edit to
    // an existing route is invisible until after commit, so the committed JSON
    // becomes stale for the first time only in CI.
    let d = hasWorkingTreeChange(sources)
      ? new Date().toISOString().slice(0, 10)
      : lastChange(sources);
    if (!d) {
      // An uncommitted route has no history yet: it is new TODAY, which is
      // the one case where "today" is the true answer rather than the lie
      // this script exists to remove. Once committed, git takes over.
      d = new Date().toISOString().slice(0, 10);
      log(`${route} has no git history yet (new page) — dated today`);
    }
    dates[route] = d;
  }
  const next = JSON.stringify(dates, null, 2) + '\n';
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (args.has('--check')) {
    if (prev !== next) { console.error('[page-dates] pageDates.json is stale — run `node scripts/page-dates.mjs`'); process.exit(1); }
    log('pageDates.json is current');
    return;
  }
  if (prev !== next) { fs.writeFileSync(OUT, next); log(`wrote ${Object.keys(dates).length} routes`); }
  else log(`unchanged (${Object.keys(dates).length} routes)`);
}
main();
