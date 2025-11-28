import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import reviewUtils from '../services/reviewUtils'; // Import review utility

function ProductCard({ product, onViewDetails, onAddToCart }) {
  if (!product) return null;

  // New state to hold the calculated average rating
  const [displayRating, setDisplayRating] = useState(product.rating || 0);
  const [reviewCount, setReviewCount] = useState(product.reviews?.length || 0);

  // Hook to calculate the dynamic rating on load
  useEffect(() => {
    // Get the dynamically calculated average rating from all sources
    const newAvg = reviewUtils.getAverageRating(product.id, product.rating);
    setDisplayRating(newAvg);
    
    const allReviews = reviewUtils.getReviews(product.id);
    setReviewCount(allReviews.length);
  }, [product.id, product.rating]);


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
              // Use the calculated displayRating
              fill={i < Math.floor(displayRating) ? '#fbbf24' : 'none'}
              stroke={i < Math.floor(displayRating) ? '#fbbf24' : '#d1d5db'}
            />
          ))}
          {/* Display the calculated average and count */}
          <span className="rating-text">({displayRating.toFixed(1)}) / {reviewCount}</span>
        </div>
        
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="price-original">${product.price}</span>
              <span className="price-discounted">
                ${discountedPrice}
              </span>
            </>
          ) : (
            <span className="price-current">${product.price}</span>
          )}
        </div>
        
        <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;