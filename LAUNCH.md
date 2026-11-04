# Min-Tech launch-day runbook

Switches `min-tech.ca` from the old site to this Vercel project. Expect about 15 minutes of work,
plus up to an hour for DNS to settle everywhere. The old site stops being served as soon as step 2 is done.

## Already done (Nov 4, 2026)

- `www.min-tech.ca` and `min-tech.ca` are added to the Vercel project `min-tech-marketing` (team CLNENV).
  Ownership is already verified; no TXT record is needed.
- `vercel.json` redirects `min-tech.ca/*` to `https://www.min-tech.ca/*` (www is the primary address).
- The old site's pages redirect to the matching new sections:
  `/spill-control-products`, `/shop` → `/#case-study`, `/recycling` → `/#buy-back`,
  `/corporate-responsibility` → `/about#sustainability`, `/contact` → `/#contact`, `/index.html` → `/`.
- `404.html` and `sitemap.xml` are live. Canonical, Open Graph and schema tags already use `https://www.min-tech.ca`.

## 1. Before you start

- [ ] Confirm the time with whoever will check the site afterwards.
- [ ] Log in to Cloudflare for `min-tech.ca`. **Screenshot the current DNS records** (for rollback).
- [ ] Leave MX, TXT (SPF/DKIM/DMARC) and any other mail records alone. Only `@` and `www` change.

## 2. Cloudflare DNS (you)

Replace the existing `@` and `www` records (currently proxied A records) with:

| Type  | Name  | Target                                  | Proxy status          |
|-------|-------|-----------------------------------------|-----------------------|
| CNAME | `@`   | `111a38e6b21cb38c.vercel-dns-016.com`   | **DNS only** (grey cloud) |
| CNAME | `www` | `111a38e6b21cb38c.vercel-dns-016.com`   | **DNS only** (grey cloud) |

- Cloudflare allows a CNAME on `@` (it flattens it automatically).
- If Cloudflare won't accept the `@` CNAME, use two A records on `@` instead: `216.150.1.1` and `216.150.16.1` (DNS only).
- Proxy must be off (grey cloud), or Vercel can't issue the SSL certificate.
- Any Cloudflare redirect rules for min-tech.ca stop applying once the proxy is off; that's expected.

## 3. Verify the domain (Claude)

- [ ] `vercel domains verify www.min-tech.ca` and `vercel domains verify min-tech.ca` both pass.
- [ ] `https://www.min-tech.ca` loads the new site with a valid certificate.
- [ ] `https://min-tech.ca` redirects to `https://www.min-tech.ca`.
- [ ] Each old URL above redirects to the right section on the real domain.

## 4. Open the site to search engines (Claude, one commit)

- [ ] `robots.txt`: replace `Disallow: /` with `Allow: /` and add `Sitemap: https://www.min-tech.ca/sitemap.xml`.
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from the five pages
      (index, about, privacy-policy, terms-of-use, trademark-usage-policy). **Keep it on `404.html`.**
- [ ] Push to `main`; the deploy goes out automatically.

## 5. Tools (you, with Claude's help)

- [ ] Google Search Console: add `https://www.min-tech.ca`, verify, submit the sitemap.
- [ ] Google Analytics (G-H6K106D1BN): set the stream URL to `https://www.min-tech.ca`; confirm `generate_lead` is a key event.
- [ ] Microsoft Clarity (z8e45o6ak9): set the site URL to `https://www.min-tech.ca`.
- [ ] HubSpot: add `www.min-tech.ca` to the tracking-code domains if HubSpot asks.
- [ ] LinkedIn Post Inspector: inspect `https://www.min-tech.ca/` so the new share card replaces the old one.

## 6. Smoke test (Claude)

- [ ] Home, About, the three policies and a fake URL (404) on desktop and phone.
- [ ] Safari, Chrome, Firefox, Edge.
- [ ] Cookie banner: reject, accept, reopen from the footer. Clarity, GA and HubSpot load only after opt-in.
- [ ] HubSpot form loads on the real domain and buttons pre-tick the right option.

## Rollback

Put the screenshotted `@` and `www` records back in Cloudflare (proxied, as before). The old site returns
within a few minutes. Nothing in the old site's hosting is touched by this launch.

## After launch

- Replace the interim policies when Charlie's final versions arrive (keep the names
  Min-Tech Marketing Inc. and Min-Tech Environmental Inc.).
- Send one real test submission and confirm it lands in HubSpot.
- Remove the `min-tech-preview-v2` alias; decide whether to keep `min-tech-preview-v1` as staging.
- Watch GA, Clarity and HubSpot for the first week.
- Add or update Min-Tech on clnenv.com.
