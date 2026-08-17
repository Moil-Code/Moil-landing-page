# Server-side performance fixes for moilapp.com

Measured 2026-08-17 against `https://moilapp.com/business` with Lighthouse
(the same engine PageSpeed Insights runs).

Baseline on production: **mobile 57, desktop 66.**

The code-side work is done and merged into the app. Everything below lives in the
**nginx config on the host**, not in this repo, so it needs someone with server
access. These are the two largest remaining wins and together they are worth more
than every code change combined.

## 1. Static assets are served with no compression (biggest single win)

`moilapp.com` returns `/_next/static/**` CSS and JS with **no `Content-Encoding`**,
even when the client sends `Accept-Encoding: gzip, deflate, br`:

```
$ curl -sI -H 'Accept-Encoding: gzip, br' https://moilapp.com/_next/static/css/73e07d0b36cc52de.css
Content-Type: text/css
Content-Length: 112074      <-- no Content-Encoding header
```

HTML *is* gzipped (Next.js does that itself), so this is specifically nginx not
compressing the files it serves from disk / proxies through.

Measured on the current build, across all built CSS + JS:

| | raw | gzip | brotli |
|---|---|---|---|
| largest CSS | 109 KB | 19 KB | 17 KB |
| second CSS | 70 KB | 13 KB | 12 KB |
| largest JS chunk | 216 KB | 59 KB | 53 KB |
| **all CSS + JS** | **1596 KB** | **477 KB (−71%)** | — |

The two CSS files are `rel="stylesheet"` in `<head>`, so they are render-blocking.
Lighthouse attributed **2213 ms** of blocked render on mobile to the 112 KB file
alone, almost all of it transfer time. Compressing it is a ~6× reduction on the
critical path.

```nginx
# in the server block (or http block)
gzip              on;
gzip_vary         on;
gzip_comp_level   6;
gzip_min_length   256;
gzip_proxied      any;
gzip_types
    text/plain text/css text/xml
    application/javascript application/json application/xml
    application/rss+xml image/svg+xml font/woff2;

# Better, if ngx_brotli is available — serve brotli to clients that accept it
# and fall back to gzip for the rest.
# brotli            on;
# brotli_comp_level 5;
# brotli_types      <same list as gzip_types>;
```

Note `image/svg+xml` and `font/woff2` in the list; do **not** add jpeg/png/webp,
which are already compressed.

Verify after reloading nginx:

```bash
curl -sI -H 'Accept-Encoding: gzip, br' https://moilapp.com/_next/static/css/ | grep -i content-encoding
```

## 2. The origin only speaks HTTP/1.1

```
$ curl -sI https://moilapp.com/business | head -1
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
```

Lighthouse costs this at **1040 ms** ("Modern HTTP"). Without HTTP/2 multiplexing
the browser is limited to ~6 parallel connections per origin, and everything queues.
It is visible in the waterfall: the JS chunks did not even *start* until 3036 ms,
because they were stuck behind the stylesheets and images.

```nginx
listen 443 ssl;
http2 on;          # nginx >= 1.25.1
# on nginx 1.18 (the version in use) it is instead:
# listen 443 ssl http2;
```

nginx 1.18 is also EOL — worth scheduling an upgrade for the security patches
independently of this.

## 3. Root document takes ~500 ms (lower priority)

`server-response-time` reported 500 ms TTFB with `x-nextjs-cache: HIT`, so the page
is prerendered and being served from cache — the time is in the network path and
nginx, not in rendering. Worth a look once 1 and 2 are done, since compression and
HTTP/2 will change the picture.

## Expected result

Fixing 1 and 2 removes ~3.2 s of the mobile critical path that no amount of
application code can reach. Combined with the code changes already made
(measured mobile 52 → 91, desktop 77 → 100 under identical local conditions),
production mobile should land well into the 80s/90s.

## Also worth knowing

- **Apollo's tracking pixel is erroring.** `https://aplo-evnt.com/api/v1/intent_pixel/track_request?app_id=…`
  returns **400** and retries, producing 9 failed requests per page load. It is
  loaded `afterInteractive` so it does not block render, but the intent tracking
  it is supposed to do is presumably not working. Someone should check the Apollo
  app id / account.
- **The superseded originals have been deleted** — the 16 PNG/JPEG files replaced
  by `.webp` are gone, taking `public/` from 12 MB to 5 MB. They remain in git
  history if any need to come back.
- **Still large and still referenced:** `compare-claude-v2.png` (2.1 MB) and
  `compare-chatgpt-v2.png` (1.6 MB) on `/compare`, and `hero.png` (392 KB) on
  `/legacy`. Not touched because they are live references on pages outside this
  pass, but the same webp treatment would cut them by a similar margin.
- **Unreferenced but not duplicates:** `testimonial-1/2/3.jpg` (92 KB total) have
  no references anywhere in the source. Left in place — they look like content
  awaiting use rather than dead weight. `llms.txt` and
  `googlec0518d3a192e9d8e.html` are also unreferenced *by design* (fetched
  directly by URL / Google Search Console verification); do not remove them.
- **`/compare` still ships the two multi-MB comparison PNGs.** They were not part
  of this pass because they are not on `/business`, but the same webp treatment
  would cut them by a similar margin.
