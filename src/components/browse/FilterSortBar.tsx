import { useState } from 'react';
import type { SortField } from '../../api/types';
import './FilterSortBar.css';

export interface BrowseFilters {
  species: string[];
  sortBy: SortField | '';
  dateField: 'harvest_date' | 'optimal_consumption_date' | 'expiration_date' | '';
  dateStart: string;
  dateEnd: string;
}

export const DEFAULT_FILTERS: BrowseFilters = {
  species: [],
  sortBy: '',
  dateField: '',
  dateStart: '',
  dateEnd: '',
};

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'price', label: 'Price' },
  { value: 'harvest_weight', label: 'Weight' },
  { value: 'harvest_date', label: 'Harvest Date' },
  { value: 'optimal_consumption_date', label: 'Optimal Consumption' },
  { value: 'expiration_date', label: 'Expiration Date' },
  { value: 'quality_score', label: 'Quality Score' },
];

const DATE_FIELD_OPTIONS = [
  { value: 'harvest_date', label: 'Harvest Date' },
  { value: 'optimal_consumption_date', label: 'Optimal Consumption' },
  { value: 'expiration_date', label: 'Expiration Date' },
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
