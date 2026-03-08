import { useEffect, useState, useCallback } from 'react';
import { getFishes, getAllSpecies } from '../api/MockServerApi';
import type { Fish, PageInfo } from '../api/types';
import FilterSortBar, { DEFAULT_FILTERS } from '../components/browse/FilterSortBar';
import type { BrowseFilters } from '../components/browse/FilterSortBar';
import FishList from '../components/browse/FishList';
import Pagination from '../components/browse/Pagination';
import './BrowsePage.css';

const PAGE_SIZE = 10;

export default function BrowsePage() {
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);
  const [fish, setFish] = useState<Fish[]>([]);
  const [page, setPage] = useState<PageInfo>({ limit: PAGE_SIZE, offset: 0, total: 0 });
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allSpecies] = useState<string[]>(() => getAllSpecies());

  const load = useCallback(
    async (currentFilters: BrowseFilters, currentOffset: number) => {
      setLoading(true);

      // Map date filter fields to API params
      const dateParams: Record<string, string> = {};
      if (currentFilters.dateField && currentFilters.dateStart) {
        const key = {
          harvest_date: 'harvestStart',
          optimal_consumption_date: 'optimalConsumptionStart',
          expiration_date: 'shelfLifeStart',
        }[currentFilters.dateField];
        if (key) dateParams[key] = currentFilters.dateStart;
      }
      if (currentFilters.dateField && currentFilters.dateEnd) {
        const key = {
          harvest_date: 'harvestEnd',
          optimal_consumption_date: 'optimalConsumptionEnd',
          expiration_date: 'shelfLifeEnd',
        }[currentFilters.dateField];
        if (key) dateParams[key] = currentFilters.dateEnd;
      }

      const result = await getFishes({
        species: currentFilters.species.length ? currentFilters.species : undefined,
        sortBy: currentFilters.sortBy || undefined,
        limit: PAGE_SIZE,
        offset: currentOffset,
        ...dateParams,
      });

      setFish(result.data);
      setPage(result.page);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    load(filters, offset);
  }, [filters, offset, load]);

  function handleFiltersChange(next: BrowseFilters) {
    setFilters(next);
    setOffset(0); // reset to first page on filter change
  }

  return (
    <main className="browse">
      <div className="browse-inner">
        <div className="browse-heading">
          <h1 className="browse-title">Available Inventory</h1>
          <p className="browse-subtitle">Fresh-caught, Shinkei-processed fish — direct from the source.</p>
        </div>

        <FilterSortBar
          allSpecies={allSpecies}
          filters={filters}
          resultCount={page.total}
          onFiltersChange={handleFiltersChange}
        />

        <FishList fish={fish} loading={loading} />

        <Pagination page={page} onPageChange={setOffset} />
      </div>
    </main>
  );
}
