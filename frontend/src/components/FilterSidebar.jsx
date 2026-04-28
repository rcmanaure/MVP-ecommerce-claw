import { categories } from '../services/products';
import './FilterSidebar.css';

/**
 * FilterSidebar component
 * @param {Object} props
 * @param {string} props.search - Current search value
 * @param {Function} props.onSearchChange - Search change handler
 * @param {string} props.selectedCategory - Current category filter
 * @param {Function} props.onCategoryChange - Category change handler
 * @param {number} props.minPrice - Current min price
 * @param {number} props.maxPrice - Current max price
 * @param {Function} props.onPriceChange - Price range change handler
 * @param {Function} props.onClearFilters - Clear all filters handler
 */
function FilterSidebar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearFilters,
}) {
  const hasActiveFilters = search || selectedCategory || minPrice || maxPrice;

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <h2 className="filter-sidebar-title">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="filter-sidebar-clear"
            onClick={onClearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="filter-section">
        <label className="filter-label" htmlFor="search-input">
          Search
        </label>
        <div className="filter-search-container">
          <span className="filter-search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="filter-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="filter-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <label className="filter-label">Category</label>
        <div className="filter-category-list">
          <button
            type="button"
            className={`filter-category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="filter-price-range">
          <div className="filter-price-inputs">
            <div className="filter-price-input-group">
              <span className="filter-price-symbol">$</span>
              <input
                type="number"
                className="filter-price-input"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) => onPriceChange(e.target.value || '', maxPrice)}
                min="0"
                step="0.01"
              />
            </div>
            <span className="filter-price-separator">—</span>
            <div className="filter-price-input-group">
              <span className="filter-price-symbol">$</span>
              <input
                type="number"
                className="filter-price-input"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) => onPriceChange(minPrice, e.target.value || '')}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
