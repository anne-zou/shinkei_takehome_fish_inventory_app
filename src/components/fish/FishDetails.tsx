import type { FishWithRecipes } from '../../api/types';
import './FishDetails.css';

interface Props {
  fish: FishWithRecipes;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const [month, day, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function qualityClass(score: number): string {
  if (score >= 90) return 'quality--high';
  if (score >= 75) return 'quality--mid';
  return 'quality--low';
}

function qualityLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  return 'Fair';
}

export default function FishDetails({ fish }: Props) {
  return (
    <div className="fish-details">
      {/* Images */}
      <div className={`fish-details-images ${fish.processed_img_url ? 'fish-details-images--dual' : ''}`}>
        <figure className="fish-details-figure">
          <img src={fish.harvest_img_url} alt={`${fish.species_name} at harvest`} className="fish-details-img" />
          <figcaption>At Harvest</figcaption>
        </figure>
        {fish.processed_img_url && (
          <figure className="fish-details-figure">
            <img src={fish.processed_img_url} alt={`${fish.species_name} processed`} className="fish-details-img" />
            <figcaption>After Processing</figcaption>
          </figure>
        )}
      </div>

      {/* Hero info */}
      <div className="fish-details-hero">
        <div className="fish-details-hero-left">
          <p className="fish-details-stage">{fish.stage}</p>
          <h1 className="fish-details-species">{fish.species_name}</h1>
          <p className="fish-details-region">{fish.harvest_region_name}</p>
        </div>
        <div className="fish-details-hero-right">
          <span className="fish-details-price">${fish.price.toFixed(2)}</span>
          <span className="fish-details-price-unit">/ kg</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="fish-details-stats">
        <div className="fish-details-stat">
          <span className="fish-details-stat-label">Weight</span>
          <span className="fish-details-stat-value">{fish.harvest_weight} kg</span>
        </div>

        <div className="fish-details-stat">
          <span className="fish-details-stat-label">Harvest Date</span>
          <span className="fish-details-stat-value">{formatDate(fish.harvest_date)}</span>
        </div>

        <div className="fish-details-stat">
          <span className="fish-details-stat-label">Optimal Consumption</span>
          <span className="fish-details-stat-value">{formatDate(fish.optimal_consumption_date)}</span>
        </div>

        <div className="fish-details-stat">
          <span className="fish-details-stat-label">Expiration Date</span>
          <span className="fish-details-stat-value">{formatDate(fish.expiration_date)}</span>
        </div>

        {fish.quality_score !== null && (
          <div className="fish-details-stat fish-details-stat--quality">
            <span className="fish-details-stat-label">Quality Score</span>
            <span className={`fish-details-quality-badge ${qualityClass(fish.quality_score)}`}>
              <strong>{fish.quality_score}</strong>
              <span>{qualityLabel(fish.quality_score)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
