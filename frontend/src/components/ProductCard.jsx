import { Link } from 'react-router-dom';
import Button from './Button';
import './ProductCard.css';

/**
 * ProductCard component
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Add to cart handler
 */
function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    price,
    images,
    category,
    stock,
  } = product;

  const mainImage = images?.[0] || 'https://picsum.photos/seed/default/600/600';
  const inStock = stock > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-card-image-container">
        <img
          src={mainImage}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
        <span className="product-card-category">{category}</span>
        {!inStock && (
          <span className="product-card-out-of-stock">Out of Stock</span>
        )}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">{formattedPrice}</p>

        <div className="product-card-actions">
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
