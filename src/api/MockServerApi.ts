import csvRaw from '../data/shinkei_takehome_mock_data.csv?raw';
import type {
  Fish,
  FishWithRecipes,
  FishListResponse,
  GetFishesParams,
  Recipe,
  SortField,
} from './types';

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr?.trim()) return null;
  const s = dateStr.trim();
  // ISO format YYYY-MM-DD (from HTML date inputs)
  if (s.includes('-')) {
    const parts = s.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }
  // M/D/YYYY format (from CSV data)
  const parts = s.split('/');
  if (parts.length !== 3) return null;
  const [month, day, year] = parts.map(Number);
  if (!month || !day || !year) return null;
  return new Date(year, month - 1, day);
}

function parseCSV(): Fish[] {
  const lines = csvRaw.trim().split('\n');
  return lines.slice(1).map((line) => {
    const [
      fish_id,
      price,
      stage,
      species_name,
      harvest_weight_kg,
      harvest_date,
      harvest_region_name,
      harvest_img_url,
      shelf_life,
      quality_score,
      optimal_consumption_date,
      processed_img_url,
    ] = parseCSVLine(line);

    return {
      fishId: fish_id.trim(),
      price: parseFloat(price),
      stage: stage.trim() as Fish['stage'],
      species_name: species_name.trim(),
      harvest_weight: parseFloat(harvest_weight_kg),
      harvest_date: harvest_date.trim(),
      harvest_region_name: harvest_region_name.trim(),
      harvest_img_url: harvest_img_url.trim(),
      expiration_date: shelf_life?.trim() || null,
      quality_score: quality_score?.trim() ? parseInt(quality_score.trim(), 10) : null,
      optimal_consumption_date: optimal_consumption_date?.trim() || null,
      processed_img_url: processed_img_url?.trim() || null,
    };
  });
}

// Lazily parsed and cached
let _fishData: Fish[] | null = null;
function getFishData(): Fish[] {
  if (!_fishData) _fishData = parseCSV();
  return _fishData;
}

// ---------------------------------------------------------------------------
// Static recipe mocks
// ---------------------------------------------------------------------------

const RECIPES_BY_SPECIES: Record<string, Recipe[]> = {
  'Yellowfin Tuna': [
    {
      title: 'Seared Ahi Tuna Steaks',
      img_url:
        'https://www.allrecipes.com/thmb/4zuqg_WLepWOgd-xHArOTLyspss=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/160099-seared-ahi-tuna-steaks-DDMFS-4x3-26f4691e91bd434e9d96c1c601608cbc.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/160099/seared-ahi-tuna-steaks/',
    },
    {
      title: 'Ahi Tuna Poke',
      img_url:
        'https://www.allrecipes.com/thmb/E7b8sgI8B17hpSXQYkEFm2XzLqo=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/12870-ahi-tuna-poke-beauty1-4x3-dea05e5e824b4b1987f78202887da37a.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/12870/ahi-poke-basic/',
    },
    {
      title: 'Avocado and Tuna Tapas',
      img_url:
        'https://www.allrecipes.com/thmb/PDDLosQL0MAqXvKJeHdGSVii9HI=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/139620-avocado-and-tuna-tapas-VAT-006-4x3-f90efeb69f774162a903ec20cd5880ac.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/139620/avocado-and-tuna-tapas/',
    },
  ],
  'Sockeye Salmon': [
    {
      title: 'Cedar Planked Salmon',
      img_url:
        'https://www.allrecipes.com/thmb/TFZLzUReiK_vjdBC5ZABwDpVbJw=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-109297-cedar-planked-salmon-DDMFS-4x3-591545d0a0b0436bba4830f3c4740ecc.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/109297/cedar-planked-salmon/',
    },
    {
      title: 'Best Salmon Patties',
      img_url: 'https://www.allrecipes.com/thmb/ISXCK6ylDf-zcBMHRCjvg3iOy6g=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9401-salmon-patties-DDMFS-beauty-4x3-BG-31797-3b64b196787243dab650d34fddb2969f.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/9401/salmon-patties-i/',
    },
    {
      title: 'Sockeye Salmon Chowder',
      img_url:
        'https://www.allrecipes.com/thmb/2qBfnZ5PG9aeiPhqlo2_NnMegjk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/26463-salmon-chowder-DDMFS-4x3-4530-540a4829cacc4f8f9db3ace5c1347fa8.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/26463/salmon-chowder/',
    },
  ],
  'Pacific Halibut': [
    {
      title: 'Grilled Halibut with Cilantro Garlic Butter',
      img_url: 'https://www.allrecipes.com/thmb/b501JCbeREeWAN4acaHkAbCy5Eg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/1026782-grilled-halibut-with-cilantro-garlic-butter-naples34102-4x3-1-0f5b67ef051045d4b87454c40941ae3d.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/103971/grilled-halibut-with-cilantro-garlic-butter/',
    },
    {
      title: 'Hearty Halibut Chowder',
      img_url:
        'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F1885760.jpg&q=60&c=sc&poi=auto&orient=true&h=512',
      recipe_page_url: 'https://www.allrecipes.com/recipe/164554/hearty-halibut-chowder/',
    },
    {
      title: 'Pan-Roasted Halibut with Clamshell Mushrooms and Lemon Butter Sauce',
      img_url: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2023%2F01%2F13%2F1100742-pan-roasted-halibut-with-clamshell-mushrooms-and-lemon-butter-sauce-Chef-John-1x1-1.jpg&q=60&c=sc&poi=auto&orient=true&h=512',
      recipe_page_url: 'https://www.allrecipes.com/recipe/236504/pan-roasted-halibut-with-clamshell-mushrooms-and-lemon-butter-sauce/',
    },
  ],
  'Tilapia': [
    {
      title: 'Coconut Tilapia with Apricot Dipping Sauce',
      img_url: 'https://www.allrecipes.com/thmb/jEUn_GFBvFjwqFjjrRTjrmUPJjA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/104789-Coconut-Tilapia-with-Apricot-Dipping-Sauce-ekk0118-4x3-1-a1a46d275903468cada705e3d635240b.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/104789/coconut-tilapia-with-apricot-dipping-sauce/',
    },
    {
      title: 'Lemon Garlic Tilapia',
      img_url:
        'https://www.allrecipes.com/thmb/wi-rdotDR2tfuWHy1WPJ5GsOJe0=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/89261-lemon-garlic-tilapia-DDMFS-4x3-febefb0fdfe34d4ea855eaeac04fc470.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/89261/lemon-garlic-tilapia/',
    },
    {
      title: 'Tilapia Scampi',
      img_url: 'https://www.allrecipes.com/thmb/AZD-12Lg_WwVK4Ooa4NvivC1e-Q=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/5130567-tilapia-scampi-naples34102-4x3-1-693c04bdf73548c1be329d2449faacb7.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/167052/tilapia-scampi/',
    },
  ],
};

// ---------------------------------------------------------------------------
// Filtering & sorting helpers
// ---------------------------------------------------------------------------

function inDateRange(
  dateStr: string | null,
  start?: string,
  end?: string,
): boolean {
  if (!start && !end) return true;
  if (!dateStr) return false;
  const date = parseDate(dateStr);
  if (!date) return true;
  if (start) {
    const s = parseDate(start);
    if (s && date < s) return false;
  }
  if (end) {
    const e = parseDate(end);
    if (e && date > e) return false;
  }
  return true;
}

function sortFish(fish: Fish[], sortBy: SortField, sortDir: 'asc' | 'desc' = 'asc'): Fish[] {
  const dir = sortDir === 'asc' ? 1 : -1;
  return [...fish].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price - b.price) * dir;
      case 'harvest_weight':
        return (a.harvest_weight - b.harvest_weight) * dir;
      case 'quality_score':
        return ((a.quality_score ?? -1) - (b.quality_score ?? -1)) * dir;
      case 'harvest_date': {
        const da = parseDate(a.harvest_date)?.getTime() ?? 0;
        const db = parseDate(b.harvest_date)?.getTime() ?? 0;
        return (da - db) * dir;
      }
      case 'optimal_consumption_date': {
        const da = parseDate(a.optimal_consumption_date)?.getTime() ?? Infinity;
        const db = parseDate(b.optimal_consumption_date)?.getTime() ?? Infinity;
        return (da - db) * dir;
      }
      case 'expiration_date': {
        const da = parseDate(a.expiration_date)?.getTime() ?? Infinity;
        const db = parseDate(b.expiration_date)?.getTime() ?? Infinity;
        return (da - db) * dir;
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Mock API — simulates network latency
// ---------------------------------------------------------------------------

const SIMULATED_DELAY_MS = 300;
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function getFishes(params: GetFishesParams = {}): Promise<FishListResponse> {
  await delay(SIMULATED_DELAY_MS);

  let data = [...getFishData()].reverse();

  if (params.stages?.length) {
    data = data.filter((f) => params.stages!.includes(f.stage));
  }
  if (params.species?.length) {
    data = data.filter((f) => params.species!.includes(f.species_name));
  }
  if (params.harvestRegions?.length) {
    data = data.filter((f) => params.harvestRegions!.includes(f.harvest_region_name));
  }
  if (params.harvestStart || params.harvestEnd) {
    data = data.filter((f) =>
      inDateRange(f.harvest_date, params.harvestStart, params.harvestEnd),
    );
  }
  if (params.shelfLifeStart || params.shelfLifeEnd) {
    data = data.filter((f) =>
      inDateRange(f.expiration_date, params.shelfLifeStart, params.shelfLifeEnd),
    );
  }
  if (params.optimalConsumptionStart || params.optimalConsumptionEnd) {
    data = data.filter((f) =>
      inDateRange(
        f.optimal_consumption_date,
        params.optimalConsumptionStart,
        params.optimalConsumptionEnd,
      ),
    );
  }
  if (params.minQualityScore !== undefined) {
    data = data.filter(
      (f) => f.quality_score !== null && f.quality_score >= params.minQualityScore!,
    );
  }
  if (params.sortBy === 'quality_score') {
    data = data.filter((f) => f.quality_score != null);
  }
  if (params.sortBy === 'expiration_date' || params.shelfLifeStart || params.shelfLifeEnd) {
    data = data.filter((f) => f.expiration_date != null && f.expiration_date !== '');
  }
  if (
    params.sortBy === 'optimal_consumption_date' ||
    params.optimalConsumptionStart ||
    params.optimalConsumptionEnd
  ) {
    data = data.filter(
      (f) => f.optimal_consumption_date != null && f.optimal_consumption_date !== '',
    );
  }
  if (params.sortBy) {
    data = sortFish(data, params.sortBy, params.sortDir);
  }

  const total = data.length;
  const limit = params.limit ?? 10;
  const offset = params.offset ?? 0;

  return {
    page: { limit, offset, total },
    data: data.slice(offset, offset + limit),
  };
}

export async function getFish(fishId: string): Promise<FishWithRecipes> {
  await delay(SIMULATED_DELAY_MS);
  const fish = getFishData().find((f) => f.fishId === fishId);
  if (!fish) throw new Error(`Fish not found: ${fishId}`);
  return { ...fish, recipes: RECIPES_BY_SPECIES[fish.species_name] ?? [] };
}

// Utility: all unique species in the dataset
export function getAllSpecies(): string[] {
  return [...new Set(getFishData().map((f) => f.species_name))].sort();
}
