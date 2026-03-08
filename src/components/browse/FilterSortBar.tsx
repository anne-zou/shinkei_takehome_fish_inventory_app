import { useState } from 'react';
import type { FishStage, SortField } from '../../api/types';
import './FilterSortBar.css';

export interface BrowseFilters {
  stages: FishStage[];
  species: string[];
  sortBy: SortField | '';
  sortDir: 'asc' | 'desc';
  dateField: 'harvest_date' | 'optimal_consumption_date' | 'expiration_date' | '';
  dateStart: string;
  dateEnd: string;
}

export const DEFAULT_FILTERS: BrowseFilters = {
  stages: [],
  species: [],
  sortBy: '',
  sortDir: 'asc',
  dateField: '',
  dateStart: '',
  dateEnd: '',
};

const STAGE_OPTIONS: { value: FishStage; label: string }[] = [
  { value: 'HARVESTED', label: 'Unprocessed' },
  { value: 'PROCESSED', label: 'Processed' },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'price', label: 'Price' },
  { value: 'harvest_weight', label: 'Weight' },
  { value: 'harvest_date', label: 'Harvest Date' },
  { value: 'optimal_consumption_date', label: 'Best Eaten Date (Processed fish only)' },
  { value: 'expiration_date', label: 'Expiration Date (Processed fish only)' },
  { value: 'quality_score', label: 'Quality Score (Processed fish only)' },
];

const DATE_FIELD_OPTIONS = [
  { value: 'harvest_date', label: 'Harvest Date' },
  { value: 'optimal_consumption_date', label: 'Best Eaten Date (Processed fish only)' },
  { value: 'expiration_date', label: 'Expiration Date (Processed fish only)' },
] as const;

interface Props {
  allSpecies: string[];
  filters: BrowseFilters;
  resultCount: number;
  onFiltersChange: (filters: BrowseFilters) => void;
}

export default function FilterSortBar({ allSpecies, filters, resultCount, onFiltersChange }: Props) {
  const [open, setOpen] = useState(false);

  function setField<K extends keyof BrowseFilters>(key: K, value: BrowseFilters[K]) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function toggleStage(stage: FishStage) {
    const next = filters.stages.includes(stage)
      ? filters.stages.filter((s) => s !== stage)
      : [...filters.stages, stage];
    setField('stages', next);
  }

  function toggleSpecies(species: string) {
    const next = filters.species.includes(species)
      ? filters.species.filter((s) => s !== species)
      : [...filters.species, species];
    setField('species', next);
  }

  function clearAll() {
    onFiltersChange(DEFAULT_FILTERS);
  }

  const hasActiveFilters =
    filters.stages.length > 0 ||
    filters.species.length > 0 ||
    filters.sortBy !== '' ||
    filters.dateField !== '' ||
    filters.dateStart !== '' ||
    filters.dateEnd !== '';

  return (
    <div className="fsbar">
      {/* ---- Toggle row ---- */}
      <div className="fsbar-toprow">
        <button
          className={`fsbar-toggle ${open ? 'fsbar-toggle--open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="fsbar-toggle-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M2 4h12M4 8h8M6 12h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Filters &amp; Sort
          {hasActiveFilters && <span className="fsbar-active-dot" />}
        </button>

        <span className="fsbar-count">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
      </div>

      {/* ---- Expandable panel ---- */}
      {open && (
        <div className="fsbar-panel">
          {/* Sort */}
          <div className="fsbar-group">
            <label className="fsbar-label">Sort by</label>
            <div className="fsbar-sort-row">
              <select
                className="fsbar-select"
                value={filters.sortBy}
                onChange={(e) => setField('sortBy', e.target.value as SortField | '')}
              >
                <option value="">Default</option>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                className={`fsbar-dir-btn ${!filters.sortBy ? 'fsbar-dir-btn--disabled' : ''}`}
                onClick={() => setField('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
                disabled={!filters.sortBy}
                aria-label={filters.sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'}
                title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  {filters.sortDir === 'asc' ? (
                    <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
                {filters.sortDir === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>

          {/* Processing stage */}
          <div className="fsbar-group">
            <label className="fsbar-label">Processing stage</label>
            <div className="fsbar-species">
              {STAGE_OPTIONS.map((o) => (
                <label key={o.value} className="fsbar-chip">
                  <input
                    type="checkbox"
                    checked={filters.stages.includes(o.value)}
                    onChange={() => toggleStage(o.value)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Species */}
          <div className="fsbar-group">
            <label className="fsbar-label">Species</label>
            <div className="fsbar-species">
              {allSpecies.map((s) => (
                <label key={s} className="fsbar-chip">
                  <input
                    type="checkbox"
                    checked={filters.species.includes(s)}
                    onChange={() => toggleSpecies(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="fsbar-group">
            <label className="fsbar-label">Date range</label>
            <div className="fsbar-date-row">
              <select
                className="fsbar-select fsbar-select--date-field"
                value={filters.dateField}
                onChange={(e) =>
                  setField(
                    'dateField',
                    e.target.value as BrowseFilters['dateField'],
                  )
                }
              >
                <option value="">Select date type</option>
                {DATE_FIELD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="fsbar-date-inputs">
                <input
                  type="date"
                  className="fsbar-date"
                  value={filters.dateStart}
                  onChange={(e) => setField('dateStart', e.target.value)}
                  placeholder="Start"
                  disabled={!filters.dateField}
                />
                <span className="fsbar-date-sep">–</span>
                <input
                  type="date"
                  className="fsbar-date"
                  value={filters.dateEnd}
                  onChange={(e) => setField('dateEnd', e.target.value)}
                  placeholder="End"
                  disabled={!filters.dateField}
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button className="fsbar-clear" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
