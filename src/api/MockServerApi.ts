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
  const parts = dateStr.trim().split('/');
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
      title: 'Seared Ahi with Sesame-Ginger Glaze',
      img_url:
        'https://www.fisheries.noaa.gov/s3//styles/original/s3/2022-08/640x427-Tuna-Yellowfin-NOAAFisheries.png',
      recipe_page_url: 'https://www.allrecipes.com/recipe/14231/seared-ahi-tuna-steaks/',
    },
    {
      title: 'Yellowfin Tuna Poke Bowl',
      img_url:
        'https://cdn.prod.website-files.com/64c871291cf9e6192ef11f7a/66690d0f15477364171dd0ee_Yellowfin%20Tuna%20Species%20Guide_hero%20banner_2880x1800.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/220219/hawaiian-poke/',
    },
    {
      title: 'Grilled Tuna Niçoise',
      img_url:
        'https://www.fisheries.noaa.gov/s3//styles/original/s3/2022-08/640x427-Tuna-Yellowfin-NOAAFisheries.png',
      recipe_page_url: 'https://www.allrecipes.com/recipe/8720/nicoise-salad/',
    },
  ],
  'Sockeye Salmon': [
    {
      title: 'Pan-Seared Sockeye with Lemon Dill',
      img_url:
        'https://wildsalmoncenter.org/wp-content/uploads/2025/10/kspencer_sockeye-1024x427.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/22566/pan-seared-salmon-i/',
    },
    {
      title: 'Honey-Glazed Sockeye Fillet',
      img_url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Sockeye_salmon_swimming_right.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/163443/glazed-salmon/',
    },
    {
      title: 'Sockeye Salmon Chowder',
      img_url:
        'https://wildsalmoncenter.org/wp-content/uploads/2025/10/kspencer_sockeye-1024x427.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/23090/salmon-chowder/',
    },
  ],
  'Pacific Halibut': [
    {
      title: 'Butter-Basted Halibut with Capers',
      img_url: 'https://www.fisheries.noaa.gov/s3//dam-migration/900x600-pacific-halibut-noaa.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/164614/butter-baked-halibut/',
    },
    {
      title: 'Halibut Tacos with Mango Salsa',
      img_url:
        'https://www.fisheries.noaa.gov/s3//styles/original/s3/2022-10/640x427-Halibut-Pacific-NOAAFisheries.png',
      recipe_page_url: 'https://www.allrecipes.com/recipe/93742/halibut-fish-tacos/',
    },
    {
      title: 'Poached Halibut in White Wine',
      img_url: 'https://www.fisheries.noaa.gov/s3//dam-migration/900x600-pacific-halibut-noaa.jpg',
      recipe_page_url: 'https://www.allrecipes.com/recipe/35852/poached-halibut/',
    },
  ],
  Tilapia: [
    {
      title: 'Lemon Garlic Baked Tilapia',
      img_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Oreochromis-niloticus-Nairobi.JPG',
      recipe_page_url: 'https://www.allrecipes.com/recipe/21014/lemon-garlic-tilapia/',
    },
    {
      title: 'Parmesan-Crusted Tilapia',
      img_url:
        'https://www.alimentarium.org/sites/default/files/media/image/2016-06/WEB---%20tilapia%20---_0.png',
      recipe_page_url: 'https://www.allrecipes.com/recipe/20040/parmesan-crusted-tilapia/',
    },
    {
      title: 'Spicy Tilapia Fish Tacos',
      img_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Oreochromis-niloticus-Nairobi.JPG',
      recipe_page_url: 'https://www.allrecipes.com/recipe/175029/spicy-tilapia-fish-tacos/',
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

function sortFish(fish: Fish[], sortBy: SortField): Fish[] {
  return [...fish].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'harvest_weight':
        return a.harvest_weight - b.harvest_weight;
      case 'quality_score':
        return (b.quality_score ?? -1) - (a.quality_score ?? -1);
      case 'harvest_date': {
        const da = parseDate(a.harvest_date)?.getTime() ?? 0;
        const db = parseDate(b.harvest_date)?.getTime() ?? 0;
        return db - da; // newest first
      }
      case 'optimal_consumption_date': {
        const da = parseDate(a.optimal_consumption_date)?.getTime() ?? Infinity;
        const db = parseDate(b.optimal_consumption_date)?.getTime() ?? Infinity;
        return da - db; // soonest first
      }
      case 'expiration_date': {
        const da = parseDate(a.expiration_date)?.getTime() ?? Infinity;
        const db = parseDate(b.expiration_date)?.getTime() ?? Infinity;
        return da - db; // soonest first
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

  let data = getFishData();

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
  if (params.sortBy) {
    data = sortFish(data, params.sortBy);
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
