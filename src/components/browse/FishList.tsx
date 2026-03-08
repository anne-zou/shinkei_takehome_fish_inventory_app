import type { Fish } from '../../api/types';
import FishListItem from './FishListItem';
import './FishList.css';

interface Props {
  fish: Fish[];
  loading: boolean;
}

export default function FishList({ fish, loading }: Props) {
  if (loading) {
    return (
      <div className="fish-list-skeletons">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="fish-list-skeleton" />
        ))}
      </div>
    );
  }

  if (fish.length === 0) {
    return (
      <div className="fish-list-empty">
        <span className="fish-list-empty-icon">🐟</span>
        <p>No fish match your filters.</p>
      </div>
    );
  }

  return (
    <ul className="fish-list" role="list">
      {fish.map((f) => (
        <li key={f.fishId}>
          <FishListItem fish={f} />
        </li>
      ))}
    </ul>
  );
}
