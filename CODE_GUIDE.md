# BioCacauChain / Qualitheo — Code Organization Guide

This document maps the codebase so AI agents and developers can locate and modify any feature instantly.

---

## ① Product Catalog

**To add, remove, or edit a product** (name, price, description, specs, images):

```ts
client/src/lib/productCatalog.ts
```

Edit the `CATALOG_PRODUCTS` array. Changes automatically appear on the B2B catalog page.

---

## ② Pages and Routes

**To add a new page or change a URL:**

```
client/src/App.tsx     ← Route definitions (lazy-loaded)
client/src/pages/      ← One file per page
```

| Page | File | URL |
| --- | --- | --- |
| Home | `home.tsx` | `/` |
| B2B Catalog | `catalogo-b2b.tsx` | `/catalogo-b2b` |
| Cart / Checkout | `carrinho.tsx` | `/carrinho` |
| Origination Hub | `originacao.tsx` | `/originacao` |
| Lot Timeline | `lote-timeline.tsx` | `/lote/:id/timeline` |
| Ceremonial Store | `loja-cerimonial.tsx` | `/loja` |
| Producer Portal | `portal-produtor.tsx` | `/portal-produtor` |
| Admin Portal | `portal-qualitheo.tsx` | `/portal-qualitheo` |
| Certification | `certificacao.tsx` | `/certificacao` |
| Producer Profile | `perfil-produtor.tsx` | `/perfil/:id` |
| B2B Invoice | `proforma.tsx` | `/pedido/:id/proforma` |

---

## ③ Layout and Navigation

**To change the header, footer, or main nav links** (used by ALL pages except Home):

```
client/src/components/layout/AppShell.tsx
```

**To change the page hero/title band:**

```
client/src/components/layout/PageHeader.tsx
```

**To change the Home page navigation:**

```
client/src/components/home/Navbar.tsx
```

---

## ④ Home Page Sections

```
client/src/components/home/
├── Navbar.tsx
├── Hero.tsx
├── InfrastructureShowcase.tsx
├── MarketThesis.tsx
├── ProcessDiagram.tsx
├── Features.tsx
├── AboutSplit.tsx
├── Products.tsx          ← "Our Products" section (same as B2B catalog)
├── Impact.tsx
├── MarketplaceSection.tsx
├── Partners.tsx
└── Footer.tsx
```

---

## ⑤ Design System

**To change brand colors or typography:**

```
client/src/index.css
```

Key tokens:

- `--color-cocoa-*` → dark brown palette
- `--color-gold-*` → amber/gold accent palette
- `--font-display` → Fraunces (serif titles)
- `--font-sans` → Manrope (body text)

---

## ⑥ B2B Product Card Component

**To change how a product card looks:**

```
client/src/components/b2b/ProductCard.tsx
```

---

## ⑦ Language and Translations

**To add/edit translated text:**

```
client/src/lib/i18n.tsx
```

---

## ⑧ Backend API Routes

```
server/routes/
├── catalog.router.ts    ← /api/products, /api/brands
├── orders.router.ts     ← /api/orders
├── market.router.ts     ← /api/precos-mercado
├── producers.router.ts  ← /api/producers
├── lots.router.ts       ← /api/lots
└── analytics.router.ts  ← /api/analytics
```

To add a new endpoint: create a router file and register it in `server/routes.ts`.

---

## ⑨ Database Schema and Migrations

```
shared/schema.ts       ← Drizzle ORM table definitions
migrations/            ← SQL migration files
server/seeds.ts        ← Initial data seeding
server/storage.ts      ← All DB queries
```

---

## ⑩ Images and Assets

```
attached_assets/         ← All static images and videos
client/public/static/    ← Product images served at /static/img/
```

---

## Adding a New Page — Checklist

1. Create `client/src/pages/my-page.tsx`
2. Wrap content in `<AppShell>` + `<PageHeader>`
3. Add route in `client/src/App.tsx`:

```tsx
const MyPage = lazy(() => import("@/pages/my-page"));
// in <Switch>:
<Route path="/my-page" component={MyPage} />
```

4. Add to nav in `AppShell.tsx` `siteLinks` array if needed
5. Run `npm run build` to verify compilation

---

## Build and Deploy

| Command | What it does |
| --- | --- |
| `npm run build` | Production build → `dist/` |
| `npm run dev` | Full dev server (Express + Vite) on port 5000 |
| `npx vite preview` | Preview production build locally |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema changes to database |

**Live URL:** `https://biocacauchain-r5owwqlthva-rj.a.run.app`

**GCP Project:** `lidacacau` | **Region:** `southamerica-east1` | **Service:** `biocacauchain`
