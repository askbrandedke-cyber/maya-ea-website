# Maya E.A. Limited: website proposal by BRANDED

A corporate website rebuild for **Maya E.A. Limited**: bakery ingredients and food additives in Kenya, Uganda and Rwanda since 2009. It includes a **proposed packaging system** for the Bakeshed range.

> Concept packaging by BRANDED — proposal only. Packaging shown in this project is not Maya's current packaging.

## Quick start

```bash
npm install
```
```bash
npm run dev
```
Open http://localhost:3000. Forms run in dry-run mode until email keys are set (see `.env.example`).

## Documents

| File | What it is |
|---|---|
| [AUDIT.md](AUDIT.md) | Audit of mayaealtd.com and bakeshed.rw, and the plan |
| [PACKAGING-SYSTEM.md](PACKAGING-SYSTEM.md) | Packaging system: colours, type, grid, zones, rules |
| [SITEMAP.md](SITEMAP.md) | 77 URLs, the job of each page, navigation, SEO map |
| [CONTENT-GUIDE.md](CONTENT-GUIDE.md) | How to edit products, packs, contacts, images and env variables |
| [PLACEHOLDERS.md](PLACEHOLDERS.md) | Every [CONFIRM: …] item needing input from Maya |
| [DEPLOY.md](DEPLOY.md) | Vercel deployment, email set-up, go-live checklist |
| `docs/previews/` | Screenshots from each build stage |
| `docs/qa-mobile/` | Mobile QA: 17 page types on iPhone SE and Pixel 7 |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion (lazy) · GSAP ScrollTrigger (scroll story only) · React Three Fiber + drei (3D packs from simple geometry) · zod · Resend (email) · deploys to Vercel.

## Scripts

`npm run labels` (pack artwork) · `npm run sync:bakeshed` (catalogue) · `npm run check:meta` (SEO titles) · `npm run build` · `npm run lint`
