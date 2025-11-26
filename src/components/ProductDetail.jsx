import React from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';

function ProductDetail({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const discountedPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="detail-container">
          <div className="detail-image-section">
            <img 
              src={product.images?.[0] || product.thumbnail} 
              alt={product.title}
              className="detail-main-image"
            />
          </div>
          
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h2 className="detail-title">{product.title}</h2>
            
            <div className="detail-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                  stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
              <span className="rating-text">
                {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            
            <p className="detail-description">{product.description}</p>
            
            <div className="detail-price-section">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="price-original">${product.price}</span>
                  <span className="price-discounted">${discountedPrice}</span>
                  <span className="savings">Save {product.discountPercentage}%</span>
                </>
              ) : (
                <span className="price-current">${product.price}</span>
              )}
            </div>
            
            <button className="btn-add-cart-large" onClick={() => onAddToCart(product)}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
