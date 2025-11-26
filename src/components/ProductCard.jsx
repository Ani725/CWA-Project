import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

function ProductCard({ product, onViewDetails, onAddToCart }) {
  // Added a check for null/undefined product prop to prevent crashes
  if (!product) return null;

  const discountedPrice = product.discountPercentage 
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <div className="product-card">
      <div className="product-image" onClick={() => onViewDetails(product)}>
        <img src={product.thumbnail} alt={product.title} />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{product.discountPercentage}%</span>
        )}
      </div>
      
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title" onClick={() => onViewDetails(product)}>
          {product.title}
        </h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
              stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
            />
          ))}
          <span className="rating-text">({product.rating})</span>
        </div>
        
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="price-original">${product.price}</span>
              <span className="price-discounted">${discountedPrice}</span>
            </>
          ) : (
            <span className="price-current">${product.price}</span>
          )}
        </div>
        
        <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
          <ShoppingCart size={16} /> Add
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
