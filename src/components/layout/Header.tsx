import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-brand">SHINKEI</span>
          <span className="header-logo-divider" />
          <span className="header-logo-sub">Fish Inventory</span>
        </Link>
      </div>
    </header>
  );
}
