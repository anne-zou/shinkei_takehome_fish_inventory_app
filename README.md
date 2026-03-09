# Shinkei Fish Inventory

A frontend-only demo of a customer-facing web app for browsing Shinkei's fish inventory. Built as part of a fullstack engineer takehome project.

## Overview

The app lets customers browse available fish inventory with filtering, sorting, and pagination, then click into a detail page for each fish.

All data is mocked and sourced from a CSV file parsed at build time through a mock API layer — no backend.

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

## Features

- Paginated list for browsing fish inventory 
- Filter by species, stage, harvest date range, best eaten date range, and expiration date range
- Sort by price, weight, quality score, harvest date, best eaten date, or expiration date
- Fish detail page displaying all information on the fish and recipe cards (static mocks)
- Detail page share button with copy-link and QR code popover
- Filter, sort, and pagination state persists across navigation

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
- 12 static recipe mocks per species defined in `MockServerApi.ts`
