# Shinkei Fish Inventory — Customer Web App

Frontend-only demo for a fullstack engineer takehome. No backend — all data comes from a CSV parsed at build time via a mock API layer.

## Tech Stack

- **React 18 + TypeScript** (strict mode) with **Vite**
- **react-router-dom v6** — BrowserRouter, Routes, Route
- **Plain CSS** (no framework) — component-scoped CSS files imported in TSX
- **No external CSV parser** — manual parser with quoted-field support

## Dev Commands

```bash
npm run dev       # start dev server
npm run build     # tsc + vite build
npm run lint      # eslint
```

## Project Structure

```
src/
  api/
    MockServerApi.ts   # CSV parser + simulated async API (300ms delay)
    types.ts           # TypeScript interfaces (Fish, Recipe, etc.)
  components/
    layout/
      Header.tsx / .css
    browse/
      FilterSortBar.tsx / .css   # filters, sort, date range
      FishList.tsx / .css        # list + skeleton loading
      FishListItem.tsx / .css    # individual fish card
      Pagination.tsx / .css
    fish/
      FishDetails.tsx / .css     # detail hero + stats grid
      RecipesSection.tsx / .css  # recipe cards
  data/
    shinkei_takehome_mock_data.csv   # source of truth — do not modify
  pages/
    BrowsePage.tsx / .css
    FishDetailPage.tsx / .css
  index.css   # CSS custom properties + global resets
  App.tsx     # router root
```

## Key Conventions

- **CSS custom properties** defined in `src/index.css`: `--accent` (#f97316 orange), `--quality-high` (green), `--bg`, `--card`, `--border`, etc.
- **Mobile-first** responsive CSS — breakpoints at 480px, 640px, 768px, 1200px.
- **Each component has its own CSS file** imported directly in the TSX file.
- **Stage labels**: HARVESTED displays as "UNPROCESSED" (orange); PROCESSED displays as "PROCESSED" (green).
- **Date formats**: CSV uses M/D/YYYY; HTML date inputs use YYYY-MM-DD. `parseDate()` handles both.
- **Shimmer skeletons** used for all loading states (no spinners).
- TypeScript strict mode — `noUnusedLocals`, `noUnusedParameters` enforced.

## Data Notes

- CSV columns: `fish_id, price, stage, species_name, harvest_weight_kg, harvest_date, harvest_region_name, harvest_img_url, shelf_life, quality_score, optimal_consumption_date, processed_img_url`
- `shelf_life` column contains an expiration date (mapped to `expiration_date` in the Fish type).
- PROCESSED stage rows have empty `quality_score`, `optimal_consumption_date`, `processed_img_url`.
- Regions contain commas (e.g. "Santa Barbara Channel, CA") — CSV parser handles quoted fields.
- Species: Yellowfin Tuna, Sockeye Salmon, Pacific Halibut, Tilapia.
- Static recipe mocks in `MockServerApi.ts` (`RECIPES_BY_SPECIES` map), 3 recipes per species.
