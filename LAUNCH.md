# Min-Tech launch-day runbook

> **Launched Nov 4, 2026.** DNS switched, `www.min-tech.ca` live on Vercel with a Let's Encrypt certificate,
> `min-tech.ca` and all old URLs redirect, robots/noindex opened (404 stays noindex), smoke test passed.
> Remaining: section 5 (Search Console, GA/Clarity URLs, HubSpot domain, LinkedIn Post Inspector) and "After launch".

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

`min-tech.ca` (`@`) currently has A records, not a CNAME. A name can't have an A record and a CNAME
at the same time, so the simplest change is to **edit the existing records** rather than add new ones:

**`@` (min-tech.ca)**: edit the existing A record(s) so there are exactly two:

| Type | Name | IPv4 address    | Proxy status              |
|------|------|-----------------|---------------------------|
| A    | `@`  | `216.150.1.1`   | **DNS only** (grey cloud) |
| A    | `@`  | `216.150.16.1`  | **DNS only** (grey cloud) |

Delete any other A or AAAA records on `@`.

**`www`**: if it's a CNAME, change its target. If it's an A record, delete it and add the CNAME:

| Type  | Name  | Target                                | Proxy status              |
|-------|-------|---------------------------------------|---------------------------|
| CNAME | `www` | `111a38e6b21cb38c.vercel-dns-016.com` | **DNS only** (grey cloud) |

(Alternative for `www`: the same two A records as `@` also work.)

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

- Final policies (Charlie, Nov 6, 2026) are live. Legal entity names must be verbatim wherever "Inc." is used:
  "Marketing Mintech Inc./Mintech Marketing Inc." and "Mintech Environmental Inc.". "Min-Tech" alone is the brand.
- Send one real test submission and confirm it lands in HubSpot.
- Remove the `min-tech-preview-v2` alias; decide whether to keep `min-tech-preview-v1` as staging.
- Watch GA, Clarity and HubSpot for the first week.
- Add or update Min-Tech on clnenv.com.
