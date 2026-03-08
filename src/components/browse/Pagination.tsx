import type { PageInfo } from '../../api/types';
import './Pagination.css';

interface Props {
  page: PageInfo;
  onPageChange: (offset: number) => void;
}

export default function Pagination({ page, onPageChange }: Props) {
  const { limit, offset, total } = page;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(offset - limit)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="pagination-pages">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`pagination-btn pagination-btn--page ${p === currentPage ? 'pagination-btn--active' : ''}`}
              onClick={() => onPageChange((p - 1) * limit)}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(offset + limit)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
