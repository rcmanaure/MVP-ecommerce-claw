import './Pagination.css';

/**
 * Pagination component
 * @param {Object} props
 * @param {number} props.page - Current page
 * @param {number} props.pages - Total pages
 * @param {Function} props.onPageChange - Page change handler
 */
function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let prev;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="pagination" aria-label="Product pagination">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="pagination-pages">
        {visiblePages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination-page ${page === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
