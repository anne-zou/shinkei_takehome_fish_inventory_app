# Shinkei Fish Inventory — Customer Web App

A frontend-only demo for browsing and exploring Shinkei's fish inventory. Built as a fullstack engineer takehome project.

## Overview

The app lets customers browse available fish inventory with filtering, sorting, and pagination, then drill into a detail page for each fish showing quality stats, harvest info, and curated recipes.

All data is sourced from a CSV file parsed at build time through a mock API layer — no backend required.

## Tech Stack

- **React 18 + TypeScript** (strict mode)
- **Vite** for bundling and dev server
- **react-router-dom v6** for client-side routing
- **Plain CSS** with custom properties — no framework
- **qrcode.react** for client-side QR code generation

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |

## Features

- Browse fish inventory with filters by species, stage, region, and harvest date range
- Sort by price, quality score, harvest date, or best eaten date
- Paginated list with shimmer skeleton loading states
- Fish detail page with quality stats, pricing, and harvest info
- Per-species recipe cards
- Share button with copy-link and QR code popover (generated client-side)
- Filter and page state persisted across navigation

## Project Structure

```
src/
  api/
    MockServerApi.ts   # CSV parser + simulated async API
    types.ts           # TypeScript interfaces
  components/
    layout/            # Header
    browse/            # FilterSortBar, FishList, FishListItem, Pagination
    fish/              # FishDetails, RecipesSection, ShareButton
  data/
    shinkei_takehome_mock_data.csv   # Source data (do not modify)
  pages/
    BrowsePage.tsx
    FishDetailPage.tsx
  App.tsx              # Router root
  index.css            # CSS custom properties + global resets
```

## Data Notes

- Species: Yellowfin Tuna, Sockeye Salmon, Pacific Halibut, Tilapia
- Stages: `HARVESTED` (shown as "Unprocessed") and `PROCESSED`
- Regions may contain commas (e.g. "Santa Barbara Channel, CA") — handled by the CSV parser
- 3 static recipe mocks per species defined in `MockServerApi.ts`
