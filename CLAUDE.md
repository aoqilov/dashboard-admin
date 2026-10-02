# CLAUDE.md

Store admin panel (do'kon adminkasi). React 19 + TS + Vite 8, Tailwind v4 + Chakra UI v3, TanStack Query v5, axios. Git: github.com/aoqilov/dashboard-admin (main). No tests.

## Commands
- `npm run dev` — dev server · `npm run build` — `tsc -b && vite build` (use as typecheck) · `npm run lint` — oxlint
- ⚠️ `npm run generate:api` — DO NOT run. `scripts/generate-api.mjs` writes an old function-style format and would overwrite the hand-written `src/api/routes/*` files.

## Structure (`@/` = `src/`)
```
api/
  api-config/   axiosInstance (baseURL = VITE_API_URL + /api/v1), interceptors (Bearer + 401 refresh → /login),
                queryClient, tokenStorage (localStorage), apiError.getErrorMessage(err)
  common.types.ts  Paginated<T>, GetAllRequest {page,pageSize,filters}, ContentStatus, PhotoProcessingStatus, TokenPair
  fetchAll.ts      fetchAll(api.getAll, filters?) — all pages (pageSize max 100), for lookups/selects
  routes/<tag>/<name>.api.ts + <name>.types.ts   one folder per swagger tag (stores-*, public-*, customers-*)
features/<name>/  Feature<Name>.tsx (page body) + components/ + modals/ (every CusDialog-based modal) + api-hooks/ + utils/
                  Form modals are persistent (isPersistent: no close on outside click). No separate create/edit pages.
  catalog/        no page (managed in /store tabs). colors, tags, materials, material groups: hooks (useCatalog.ts),
                  modals/CatalogItemDialog (create/edit, quick-create in product form)
  categories/     useCategories() → {roots, childrenOf, byId}; master-detail page
  products/       table list (FeatureProducts, URL filters + ProductFilterDrawer) + modals/: ProductFormModal (3 steps:
                  1 name+classification, 2 prices+attributes, 3 photos: upload all to pool, drag into variants; persistent, asks before closing dirty), ProductPriceModal, duplicate
                  (= form modal with duplicateValues, no photos). Sections in components/form/*, mapping in utils/productForm.ts
  store/          /store?tab=… one row of tabs; each tab = components/<X>Tab (CrudSection: table + ⋯ menu + delete confirm)
                  + modals/<X>Modal (CusFormDialog + useEntityForm). Colors/tags/materials tabs reuse catalog hooks + CatalogItemDialog
pages/admin/      thin wrappers: `export default () => <FeatureX />`; pages/Login.tsx
router/router.ts  matchPath, RouteContext, useParams(), useSearchParams()
components/
  ui/<kind>/Cus*.tsx      UI kit (CusButton, CusInput, CusField, CusSelect, CusCombobox, CusTable, CusPagination, CusDialog,
                          CusFormDialog (form + Bekor/Saqlash, persistent), CusDialogDelete, CusDrawer, CusTabs, CusSegment, CusBadge, CusTag, CusMenu, CusEmptyState, CusSkeleton…)
  shared/                 CusCard/CusCardHeader, PageHeader {title,description,actions}, CusStatItem
  layout/admin/           AppLayout, header/, sidebar/ (sidebarNav.ts = menu), PageGrid (12-col grid)
  charts/BaseChart.tsx    ApexCharts wrapper; options in config/charts
context/ + hooks/useTheme  light/dark (`.dark` on <html>) + accent
hooks/useCrudMutations.ts  create/update/remove mutations for a simple CRUD route + invalidate
hooks/useEntityForm.ts     modal form: values/errors/set, validate → save → toast, DRF 400 field errors → fields
theme/            tokens.ts (ColorVariant class maps), accents.ts
style/chakra-system.ts  Chakra tokens bound to index.css vars (preflight off)
index.css         Tailwind @theme tokens (colors, text scale, radius, spacing) + accent scales + dark overrides
utils/            cn(), navigate(), media (mediaUrl, photoUrl), format (formatPrice/Date/Compact), slugify,
                  phone (CusPhoneInput keeps 9 digits: parseUzPhone ← API, toUzPhone → API, displayUzPhone), validate (isEmail, isUrl, normalizeUrl)
pages/admin/DevUI.tsx  /preview-dev — live demo of every Cus* component (look here for usage examples)
```

## Routing (no router lib)
`App.tsx` `ROUTES` map: id → {path (params ok: '/x/:id'), page, public?, nav? (sidebar id to highlight)}. Order matters: '/x/new' before '/x/:id'.
Adding a page = 1) `features/x/FeatureX.tsx`, 2) `pages/admin/X.tsx`, 3) entry in `ROUTES`, 4) same id in `sidebarNav.ts`.
`useParams()`, `useSearchParams()` (setter replaces history — for list filters) from `@/router/router`. Nav: `navigate('/path?x=1')` from `@/utils/navigate`.

## API conventions
- Route file = object with async methods, returns `data`:
  ```ts
  export const storeTags = {
    async getAll(body: GetAllRequest = {}) {   // list = POST .../get-all/
      const { data } = await api.post<Paginated<StoreTag>>('/stores/tags/get-all/', body)
      return data
    },
    // getOne(id) GET /x/{id}/ · create(body) POST /x/ · update(id, body) PATCH /x/{id}/ · delete(id) DELETE /x/{id}/
  }
  ```
  Paths without `/api/v1`, with trailing `/`. `UpdateRequest = Partial<Request>`. Response fields are snake_case (`created_at`).
- get-all filters: `{field: value}` exact/icontains, `{field: [a,b]}` IN, `{field: {gte, lte, ...}}` ranges.
- FormData uploads: pass FormData directly, don't set Content-Type.
- Hooks live in `features/<x>/api-hooks/useX.ts`, wrap `storeX.method` in useQuery/useMutation; invalidate on success. Simple CRUD → `useCrudMutations(queryKey, api)`.
- Media URLs may be relative: always `mediaUrl()` / `photoUrl(photo, quality)`. Prices are decimal strings ("1450.00"): `formatPrice()`.
- Errors to user: `toaster.create({ type: 'error', title: getErrorMessage(err) })` (`@/components/ui/toaster/toaster`).
- API spec: `swigerapi.yaml` (6k lines — never read whole; Grep for the path/schema name, then Read with offset).

## Domain notes
- Category = StoreCategory; subcategory = category with `parent`.
- Product photos: upload first (POST /stores/product-photos/ FormData `image`) → id; `processing_status` pending→ready (form polls every 3s). Product saves `variants: [{photos: ids}]`. Variant = photo set only (no color/size) — open question to backend. Form step 3: utils/photoState.ts (pool + variants, move/patch/remove); unassigned pool photos block save.
- Product form mapping: `features/products/utils/productForm.ts` (toFormValues / validate / toRequest / serverFieldErrors, step fields, duplicateValues, price-only helpers).

## Styling rules
- Visual style = AdminKit (light: #f5f7fb/white, dark: navy #121a23/#1a2430, primary #3b7ddd, Inter, 4px radius, borderless cards with `shadow-card`).
- Tailwind classes with project tokens: `bg-surface bg-body bg-panel bg-topbar bg-hover border-border border-border-strong text-heading text-content text-muted text-subtle text-primary rounded-card rounded-control shadow-xs shadow-card`. Dark mode via `dark:`. Merge with `cn()`.
- Accent (Settings → Ko'rinish): `<html data-accent>` switches `--brand-*` scale in index.css; `--color-primary*` and Chakra `brand` read it. Adding an accent = CSS block + entry in `theme/accents.ts`. Charts need hex: `getAccentColor(accent, theme)`, never hardcode primary.
- Prefer existing `Cus*` components; Chakra only inside ui-kit components. Icons: `lucide-react`.
- Page layout: `<div className="flex flex-col gap-6"><PageHeader …/><CusCard>…</CusCard></div>`.

## Code style
- Comments and UI text in Uzbek (Latin); some menu labels Russian. Short JSDoc `/** */` above exports.
- No semicolons, single quotes, 2-space indent, named exports for components (default export for Feature*/pages).
- `verbatimModuleSyntax`: use `import type` for types. `noUnusedLocals/Parameters` on. Component files export only components (oxlint only-export-components) — constants go to utils/.
- Shell: no python; use node -e or Edit/Write. Avoid backticks inside bash heredocs/strings.

## Status
Done: auth, layout, UI kit, dashboard (haqiqiy: reports + orders, davr tanlagichi, features/dashboard), settings accent, categories, products (table + URL filters, 3-step create/edit modal, price modal, duplicate), store (/store: info, addresses, contacts, services, social links, colors, tags, materials, material groups). news + discounts (CrudSection jadval, NewsModal/DiscountModal; holat muddatdan hisoblanadi: utils/schedule.ts — boshlanmagan=draft, muddat ichida=active, tugagan=archived; faol chegirma mahsulot narxida eski narx chizilib ko'rinadi: discounts/utils/discountPrice.ts).
Open: Icon.name meaning (lucide name?) unknown — services show it as text.
