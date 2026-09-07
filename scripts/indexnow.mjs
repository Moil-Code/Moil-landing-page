#!/usr/bin/env node
/**
 * IndexNow — tell Bing (and Yandex, Naver, Seznam) which URLs changed, the
 * moment they change, instead of waiting for a recrawl of a low-authority
 * domain. Plan 8.3 (F11): ChatGPT search reads the Bing index, and until
 * this existed nothing on any Moil host had ever told Bing anything.
 *
 * What it submits: EXACTLY the <loc> entries of the served sitemap, read from
 * a running build (`--base`), so nothing off-sitemap can ever be submitted.
 * The key is public by protocol design — the endpoint proves host ownership
 * by fetching https://<host>/<key>.txt — so it lives in public/ and here.
 *
 * Usage:
 *   node scripts/indexnow.mjs --dry-run                 # print the payload, post nothing
 *   node scripts/indexnow.mjs --base http://127.0.0.1:3000 --host www.moilapp.com
 *
 * Exit codes: 0 posted (or dry run); 1 the endpoint answered non-2xx or the
 * sitemap could not be read — loud on purpose, so a dead key is noticed.
 * The deploy script runs it only when INDEXNOW_SUBMIT=1 is set on the host:
 * this repo deploys STAGEBETA, whose sitemap lists production URLs, and a
 * staging deploy must not announce production changes.
 */
import fs from 'node:fs';
import path from 'node:path';

export const INDEXNOW_KEY = 'e1266a0a275f8f275bcbc64f5e4a4312';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const dryRun = argv.includes('--dry-run');
const base = (flag('--base', process.env.INDEXNOW_BASE || 'http://127.0.0.1:3000')).replace(/\/$/, '');
const host = flag('--host', process.env.INDEXNOW_HOST || 'www.moilapp.com');

export function locsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

export function buildPayload(urls) {
  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList: urls.filter((u) => new URL(u).host === host),
  };
}

async function main() {
  const keyFile = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public', `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFile) || fs.readFileSync(keyFile, 'utf8').trim() !== INDEXNOW_KEY) {
    console.error(`[indexnow] public/${INDEXNOW_KEY}.txt is missing or does not hold the key`);
    process.exit(1);
  }
  let xml;
  try {
    const res = await fetch(`${base}/sitemap.xml`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.error(`[indexnow] could not read ${base}/sitemap.xml: ${err.message}`);
    process.exit(1);
  }
  const payload = buildPayload(locsFromSitemap(xml));
  if (payload.urlList.length === 0) {
    console.error('[indexnow] the sitemap yielded no URLs on the submitted host — refusing to post an empty list');
    process.exit(1);
  }
  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`[indexnow] --dry-run: ${payload.urlList.length} URLs, nothing was posted.`);
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`[indexnow] ${ENDPOINT} answered ${res.status}: ${body.slice(0, 300)}`);
    process.exit(1);
  }
  console.log(`[indexnow] submitted ${payload.urlList.length} URLs for ${host} (HTTP ${res.status})`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((err) => { console.error('[indexnow]', err); process.exit(1); });
}
