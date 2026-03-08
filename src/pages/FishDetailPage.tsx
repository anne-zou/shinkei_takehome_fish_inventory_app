import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFish } from '../api/MockServerApi';
import type { FishWithRecipes } from '../api/types';
import FishDetails from '../components/fish/FishDetails';
import RecipesSection from '../components/fish/RecipesSection';
import ShareButton from '../components/fish/ShareButton';
import './FishDetailPage.css';

export default function FishDetailPage() {
  const { fishId } = useParams<{ fishId: string }>();
  const navigate = useNavigate();
  const [fish, setFish] = useState<FishWithRecipes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fishId) return;
    setLoading(true);
    setError(null);
    getFish(fishId)
      .then(setFish)
      .catch(() => setError('Fish not found.'))
      .finally(() => setLoading(false));
  }, [fishId]);

  return (
    <main className="detail">
      <div className="detail-inner">
        <div className="detail-topnav">
          <button className="detail-back" onClick={() => navigate(-1)} aria-label="Back to inventory">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Inventory
          </button>
          <ShareButton />
        </div>

        {loading && (
          <div className="detail-skeleton-wrap">
            <div className="detail-skeleton detail-skeleton--images" />
            <div className="detail-skeleton detail-skeleton--hero" />
            <div className="detail-skeleton detail-skeleton--stats" />
          </div>
        )}

        {error && (
          <div className="detail-error">
            <p>{error}</p>
            <button className="detail-error-btn" onClick={() => navigate('/')}>
              Return to inventory
            </button>
          </div>
        )}

        {fish && !loading && (
          <>
            <FishDetails fish={fish} />
            <RecipesSection recipes={fish.recipes} speciesName={fish.species_name} />
          </>
        )}
      </div>
    </main>
  );
}
