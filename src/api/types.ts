export type FishStage = 'HARVESTED' | 'PROCESSED';

export type SortField =
  | 'price'
  | 'harvest_weight'
  | 'harvest_date'
  | 'optimal_consumption_date'
  | 'expiration_date'
  | 'quality_score';

export interface Fish {
  fishId: string;
  price: number;
  stage: FishStage;
  species_name: string;
  harvest_weight: number;
  harvest_date: string;
  harvest_region_name: string;
  harvest_img_url: string;
  expiration_date: string | null;
  quality_score: number | null;
  optimal_consumption_date: string | null;
  processed_img_url: string | null;
}

export interface Recipe {
  title: string;
  img_url: string;
  recipe_page_url: string;
}

export interface FishWithRecipes extends Fish {
  recipes: Recipe[];
}

export interface PageInfo {
  limit: number;
  offset: number;
  total: number;
}

export interface FishListResponse {
  page: PageInfo;
  data: Fish[];
}

export interface GetFishesParams {
  stages?: FishStage[];
  species?: string[];
  harvestStart?: string;
  harvestEnd?: string;
  harvestRegions?: string[];
  minQualityScore?: number;
  shelfLifeStart?: string;
  shelfLifeEnd?: string;
  optimalConsumptionStart?: string;
  optimalConsumptionEnd?: string;
  sortBy?: SortField;
  limit?: number;
  offset?: number;
}
