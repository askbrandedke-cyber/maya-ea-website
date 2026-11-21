# Deploying to Vercel

The site is a standard Next.js 15 App Router project. Every page is static except the two form endpoints (`/api/wholesale`, `/api/contact`). You need no database and no special build settings.

## 1. Before the first deploy

1. Put the project in a Git repository (GitHub, GitLab or Bitbucket). `.env.local`, `node_modules`, `.next` and `_research/` are already in `.gitignore`.
2. Check that it builds locally:
   ```bash
   npm ci
   ```
   ```bash
   npm run build
   ```
   You should see about 150 static pages and no errors. Node 20.9 or newer is required (set in `package.json` → `engines`).

## 2. Create the Vercel project

1. Go to vercel.com → **Add New… → Project** → import the repository.
2. Framework preset: **Next.js** (detected automatically). Leave the build command (`next build`), output directory and install command on their defaults.
3. Under **Environment Variables**, add the values from `.env.example`. The proposal-build values are below.

| Variable | Proposal / preview | Go-live (after Maya approves) |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` | `https://www.mayaealtd.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` (no Google indexing) | `true` |
| `RESEND_API_KEY` | empty → forms run in **dry-run** | key from resend.com |
| `ENQUIRY_FROM` | — | e.g. `Maya website <website@mayaealtd.com>` |
| `ENQUIRY_TO_KE` / `_UG` / `_RW` | — | the inbox for each country **[CONFIRM with Maya]** |
| `ENQUIRY_TO_DEFAULT` | — | the inbox for "Other" countries and any unset country |

4. Click **Deploy**. Vercel gives you a preview URL; share this with Maya for the presentation.

> `NEXT_PUBLIC_*` values are baked in at build time. After changing one, use **Deployments → … → Redeploy**.

## 3. Turning on email (forms)

1. Create a resend.com account, then go to **Domains → Add domain** → `mayaealtd.com` (or a subdomain such as `mail.mayaealtd.com`).
2. Add the DNS records Resend shows (SPF, DKIM and optionally DMARC) at Maya's DNS provider, and wait for the status to show **Verified**.
3. Go to **API Keys → Create** with sending access only. Paste the key into Vercel as `RESEND_API_KEY`.
4. Set `ENQUIRY_FROM` to an address on the verified domain, and set the `ENQUIRY_TO_*` inboxes.
5. Redeploy. Then send a test from `/wholesale` choosing each country, and check that each email lands in the right inbox and that **Reply** goes to the buyer.

Until step 5, the forms validate and log enquiries in **Vercel → Logs**, and nothing is emailed. The success screen tells the visitor this is a dry run.

**Spam protection** is built in: a hidden honeypot field, rejection of submissions made in under 3 seconds, and a limit of 5 enquiries per 10 minutes per IP address. The rate limit is held in memory per server instance. If spam ever gets through at volume, replace `rateLimited()` in `lib/forms/server.ts` with Upstash Redis (`@upstash/ratelimit`, free tier).

## 4. Custom domain (go-live only)

1. In Vercel, go to **Settings → Domains → Add** → `www.mayaealtd.com` and `mayaealtd.com`. Set the apex to redirect to `www`.
2. At Maya's DNS provider, add the records Vercel shows: a CNAME for `www` to `cname.vercel-dns.com`, and an A record for the apex as instructed.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.mayaealtd.com` and `NEXT_PUBLIC_ALLOW_INDEXING=true`, then redeploy.
4. Check:
   - `https://www.mayaealtd.com/robots.txt` shows `Allow: /` and the sitemap line.
   - `/sitemap.xml` lists 77 URLs.
5. In **Google Search Console**, add the property, verify it by DNS, and submit `https://www.mayaealtd.com/sitemap.xml`.

The current site's paths (`/about`, `/press`, `/products`, `/careers`, `/team`, `/contact`) still exist, so no redirects are needed.

> **Packaging is still a proposal at go-live** unless Maya adopts it. Before switching on indexing, decide with Maya whether `/packaging` and the concept packs stay public. If they don't, remove "Packaging proposal" from `primaryNav` in `content/site.ts`; the concept tag stays on every pack regardless.

## 5. Updating content after launch

- Edit the files in `/content`, then commit. Vercel redeploys automatically.
- Refresh products from the shop: `npm run sync:bakeshed`, then commit `content/catalogue.generated.ts` and `public/catalogue/`.
- Regenerate the pack artwork after changing products or categories: `npm run labels`, then commit `public/packaging/`.
- Full details: **CONTENT-GUIDE.md**.

## 6. Checks after every deploy

```bash
npm run check:meta
```
This confirms that titles and descriptions are unique and within length limits.

Then open the preview URL on a phone using mobile data, and check:
- the hero shows the packs
- the 3D appears after you touch or scroll the page
- WhatsApp buttons open the app with a message already written
