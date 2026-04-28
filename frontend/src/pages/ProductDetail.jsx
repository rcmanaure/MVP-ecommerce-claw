import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addToCart, categories } from '../services/products';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './ProductDetail.css';

/**
 * ProductDetail page - Full product information
 */
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState({ type: '', message: '' });
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await getProduct(id);
        setProduct(result.data);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      setCartMessage({ type: 'success', message: `${quantity} item${quantity > 1 ? 's' : ''} added to cart!` });
      setTimeout(() => setCartMessage({ type: '', message: '' }), 3000);
    } catch (err) {
      setCartMessage({ type: 'error', message: err.message });
      setTimeout(() => setCartMessage({ type: '', message: '' }), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product?.stock || 1)));
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="loading-spinner" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-error">
          <Alert type="error" message={error || 'Product not found'} visible />
          <Button variant="secondary" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://picsum.photos/seed/default/600/600'];

  return (
    <div className="product-detail-page">
      <button
        type="button"
        className="product-detail-back"
        onClick={() => navigate('/products')}
      >
        ← Back to Products
      </button>

      {cartMessage.message && (
        <Alert type={cartMessage.type} message={cartMessage.message} visible />
      )}

      <div className="product-detail-layout">
        {/* Image gallery */}
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="product-detail-image"
            />
            {!inStock && (
              <span className="product-detail-out-of-stock">Out of Stock</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-detail-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-detail-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="product-detail-info">
          <span className="product-detail-category">{getCategoryName(product.category)}</span>

          <h1 className="product-detail-name">{product.name}</h1>

          <p className="product-detail-price">{formatPrice(product.price)}</p>

          <p className="product-detail-description">{product.description}</p>

          {/* Stock status */}
          <div className="product-detail-stock">
            {inStock ? (
              <span className="product-detail-in-stock">
                <span className="product-detail-stock-dot" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="product-detail-out-of-stock-text">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity selector */}
          {inStock && (
            <div className="product-detail-quantity">
              <label className="product-detail-quantity-label">Quantity:</label>
              <div className="product-detail-quantity-controls">
                <button
                  type="button"
                  className="product-detail-quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="product-detail-quantity-value">{quantity}</span>
                <button
                  type="button"
                  className="product-detail-quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="product-detail-actions">
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={!inStock}
              loading={addingToCart}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
