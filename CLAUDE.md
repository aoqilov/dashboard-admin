# CLAUDE.md

Store admin panel (do'kon adminkasi). React 19 + TS + Vite 8, Tailwind v4 + Chakra UI v3, TanStack Query v5, axios. No git repo, no tests.

## Commands
- `npm run dev` — dev server · `npm run build` — `tsc -b && vite build` (use as typecheck) · `npm run lint` — oxlint
- ⚠️ `npm run generate:api` — DO NOT run. `scripts/generate-api.mjs` writes an old function-style format and would overwrite the hand-written `src/api/routes/*` files.

## Structure (`@/` = `src/`)
```
api/
  api-config/   axiosInstance (baseURL = VITE_API_URL + /api/v1), interceptors (Bearer + 401 refresh → /login),
                queryClient, tokenStorage (localStorage), apiError.getErrorMessage(err)
  common.types.ts  Paginated<T>, GetAllRequest {page,pageSize,filters}, ContentStatus, PhotoProcessingStatus, TokenPair
  routes/<tag>/<name>.api.ts + <name>.types.ts   one folder per swagger tag (stores-*, public-*, customers-*)
features/<name>/  Feature<Name>.tsx (page body) + components/ + api-hooks/ (useQuery/useMutation hooks)
pages/admin/      thin wrappers: `export default () => <FeatureX />`; pages/Login.tsx
components/
  ui/<kind>/Cus*.tsx      UI kit (CusButton, CusInput, CusField, CusSelect, CusTable, CusPagination, CusDialog,
                          CusDialogDelete, CusDrawer, CusTabs, CusBadge, CusEmptyState, CusSpinner, CusFileUpload…)
  shared/                 CusCard/CusCardHeader, PageHeader {title,description,actions}, CusStatItem
  layout/admin/           AppLayout, header/, sidebar/ (sidebarNav.ts = menu), PageGrid (12-col grid)
  charts/BaseChart.tsx    ApexCharts wrapper; options in config/charts
context/ + hooks/useTheme  light/dark via `.dark` on <html>
theme/tokens.ts   ColorVariant + SOFT/SOLID/TEXT_COLORS class maps
style/chakra-system.ts  Chakra tokens bound to index.css vars (preflight off)
index.css         Tailwind @theme tokens (colors, text scale, radius, spacing)
utils/            cn(), navigate(path), phone
data/dashboard.ts mock data for dashboard
pages/admin/DevUI.tsx  /preview-dev — live demo of every Cus* component (look here for usage examples)
```

## Routing (no router lib)
`App.tsx` `ROUTES` map: id → {path, page, public?}. Adding a page = 1) `features/x/FeatureX.tsx`, 2) `pages/admin/X.tsx`, 3) entry in `ROUTES`, 4) same id in `sidebarNav.ts`. Programmatic nav: `navigate('/path')` from `@/utils/navigate`.

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
- FormData uploads: pass FormData directly, don't set Content-Type.
- Hooks live in `features/<x>/api-hooks/useX.ts`, wrap `storeX.method` in useQuery/useMutation; invalidate queries on mutation success.
- Errors to user: `toaster.create({ type: 'error', title: getErrorMessage(err) })` (`@/components/ui/toaster/toaster`).
- API spec: `swigerapi.yaml` (6k lines — never read whole; Grep for the path/schema name, then Read with offset).

## Styling rules
- Tailwind classes with project tokens: `bg-surface bg-body bg-hover border-border border-border-strong text-heading text-content text-muted text-subtle text-primary rounded-card rounded-control shadow-xs`. Dark mode via `dark:`. Merge with `cn()`.
- Prefer existing `Cus*` components; Chakra only inside ui-kit components. Icons: `lucide-react`.
- Page layout: `<div className="flex flex-col gap-6"><PageHeader …/><CusCard>…</CusCard></div>`.

## Code style
- Comments and UI text in Uzbek (Latin); some menu labels Russian. Short JSDoc `/** */` above exports.
- No semicolons, single quotes, 2-space indent, named exports for components (default export for Feature*/pages).
- `verbatimModuleSyntax`: use `import type` for types. `noUnusedLocals/Parameters` on.

## Status
Done: auth/login, layout, UI kit, dashboard (mock data). Feature pages products/categories/discounts/news/store/settings are placeholders (empty state) — to be wired to `api/routes/stores-*`.
