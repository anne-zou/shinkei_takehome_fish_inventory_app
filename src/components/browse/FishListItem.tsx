import { useNavigate } from 'react-router-dom';
import type { Fish } from '../../api/types';
import './FishListItem.css';

interface Props {
  fish: Fish;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const [month, day, year] = dateStr.split('/');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function qualityClass(score: number): string {
  if (score >= 90) return 'quality--high';
  if (score >= 75) return 'quality--mid';
  return 'quality--low';
}

export default function FishListItem({ fish }: Props) {
  const navigate = useNavigate();

  return (
    <article
      className="fish-item"
      onClick={() => navigate(`/fish/${fish.fishId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/fish/${fish.fishId}`)}
      aria-label={`View details for ${fish.species_name}`}
    >
      {/* Image */}
      <div className="fish-item-img-wrap">
        <img
          src={fish.harvest_img_url}
          alt={fish.species_name}
          className="fish-item-img"
          loading="lazy"
        />
        <span className={`fish-item-stage fish-item-stage--${fish.stage.toLowerCase()}`}>
          {fish.stage === 'HARVESTED' ? 'UNPROCESSED' : fish.stage}
        </span>
      </div>

      {/* Details */}
      <div className="fish-item-body">
        <div className="fish-item-header">
          <h2 className="fish-item-species">{fish.species_name}</h2>
          {fish.quality_score !== null && (
            <span className={`fish-item-quality ${qualityClass(fish.quality_score)}`}>
              {fish.quality_score}
            </span>
          )}
        </div>

        <div className="fish-item-meta">
          <span className="fish-item-price">${fish.price.toFixed(2)}</span>
          <span className="fish-item-weight">{fish.harvest_weight} kg</span>
          <span className="fish-item-dot" />
          <span className="fish-item-price-unit">${(fish.price / fish.harvest_weight).toFixed(2)}/kg</span>
          <span className="fish-item-dot" />
          <span className="fish-item-region">{fish.harvest_region_name}</span>
        </div>

        <div className="fish-item-dates">
          <div className="fish-item-date">
            <span className="fish-item-date-label">Harvested</span>
            <span className="fish-item-date-value">{formatDate(fish.harvest_date)}</span>
          </div>
          {fish.optimal_consumption_date && (
            <div className="fish-item-date">
              <span className="fish-item-date-label">Best Eaten</span>
              <span className="fish-item-date-value">{formatDate(fish.optimal_consumption_date)}</span>
            </div>
          )}
          {fish.expiration_date && (
            <div className="fish-item-date">
              <span className="fish-item-date-label">Expires</span>
              <span className="fish-item-date-value">{formatDate(fish.expiration_date)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="fish-item-arrow" aria-hidden>›</div>
    </article>
  );
}
