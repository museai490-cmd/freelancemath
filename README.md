# FreelanceMath – deploy & grow guide

Static site, no backend, no database. `node build.js` writes the site to `dist/` (12 tool pages, directory, home, 6 info/legal pages, sitemap, robots, 404, ads.txt when configured). The build runs self-tests on the calculators and fails if a formula is wrong.

## 1. Before you deploy
1. Pick a name/domain. Replace `FreelanceMath` in `build.js` if you want another brand.
2. Set environment variables (never edit them into the code):
   `SITE_URL=https://yourdomain.com` `CONTACT_EMAIL=you@yourdomain.com`
   Later: `GA_ID=G-XXXXXXX` and `ADSENSE_PUB=ca-pub-XXXXXXXXXXXXXXXX`.
3. Use a real, monitored email. The Contact and Privacy pages point to it.

## 2. Deploy free (recommended: Cloudflare Pages)
Push the folder to GitHub → Cloudflare Dashboard → Workers & Pages → Create → Pages → connect repo.
Build command `node build.js`, output directory `dist`, add the env vars above. (Netlify works the same way; GitHub Pages only works well on a root custom domain because links start with `/`.)

**Domain:** Pages project → Custom domains → add your domain and follow the DNS prompts (if the domain is registered elsewhere, add the CNAME it shows). Update `SITE_URL` and redeploy.

## 3. Search Console
Add the domain property → verify via DNS TXT record → Sitemaps → submit `https://yourdomain.com/sitemap.xml`. Use URL Inspection → Request indexing for the home page and your top 5 tools.

## 4. Analytics (GA4)
Create a GA4 property → Web data stream → copy the `G-` ID into `GA_ID` and redeploy. Link GA4 to Search Console under Admin → Product links.

## 5. AdSense checklist
- [ ] Own domain, live for a while, with all pages reachable
- [ ] Real contact email, privacy/terms/disclaimer/cookie pages (included; review them for your situation)
- [ ] Content you wrote and checked; add more tools and guides before applying
- [ ] No copied text, no fake reviews, no deceptive layout
- [ ] Apply at adsense.google.com, add `ADSENSE_PUB`, redeploy (this adds the AdSense script and generates `ads.txt`)
- [ ] After approval, create ad units; in `build.js` remove `hidden` from the `AD` placeholder and paste the unit code
- [ ] **Visitors from the EEA, UK and Switzerland need a Google-certified consent management platform (CMP).** The built-in notice is only informational and is NOT a CMP. Set one up in AdSense → Privacy & messaging before showing ads there.

Approval is at Google's discretion and not guaranteed. Never click your own ads or ask others to.

## 6. 30-day plan
- **Week 1:** deploy, Search Console, GA4. Read every tool page once and fix anything unclear.
- **Week 2:** add 4–6 tools (see below). Write one guide per tool cluster, e.g. "How to set a freelance hourly rate", with your own worked numbers and links to the tool.
- **Week 3:** share useful tools where freelancers ask for help (forums, communities), following each community's rules. Answer questions and link only when relevant.
- **Week 4:** review Search Console queries; improve pages that get impressions but few clicks (titles, intro, FAQ). Apply for AdSense once you have a solid body of original content.

SEO is slow: expect weeks to months before meaningful organic traffic. No traffic or revenue figures are promised.

## 7. Maintenance & expansion
Add a tool by adding one object to the `T` array in `build.js` (fields, `fn`, text) and a matching `near(...)` test. Ideas: late-fee, freelance tax set-aside, retainer pricing, currency-neutral rate converter, cash-runway, utilization rate, discount calculator, subscription churn. Review formulas yearly and keep the policy pages in sync with any services you add.

Known limitations: legal pages are general templates, not legal advice; there is no social-share image yet; no automated browser tests (tools are tested in Node).
