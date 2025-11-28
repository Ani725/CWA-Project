import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';
import reviewUtils from '../services/reviewUtils'; 

// ReviewForm component
const ReviewForm = ({ productId, onReviewSubmitted }) => {
    // State to hold the selected rating
    const [rating, setRating] = useState(0); 
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            alert('Please provide a rating and a comment.');
            return;
        }

        const newReview = {
            rating,
            comment,
            reviewerName: name,
        };

        const updatedUserReviews = reviewUtils.addReview(productId, newReview); 
        onReviewSubmitted(updatedUserReviews);

        setRating(0);
        setComment('');
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Write a Review</h3>
            <div className="form-group">
                <label>Rating: **{rating} Stars**</label>
                <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={20}
                            fill={rating >= star ? '#fbbf24' : 'none'}
                            stroke={rating >= star ? '#fbbf24' : '#d1d5db'}
                            onClick={() => setRating(star)}
                            style={{ cursor: 'pointer' }} 
                        />
                    ))}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="name">Name (Optional):</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button type="submit" className="btn-submit-review">Submit Review</button>
        </form>
    );
};


function ProductDetail({ product, onClose, onAddToCart }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(product.rating || 0);

    const getCombinedReviewsAndAverage = (localReviews) => {
        const apiReviews = product.reviews || []; 
        
        const mappedApiReviews = apiReviews.map(review => ({
            rating: review.rating,
            comment: review.comment,
            date: review.date?.slice(0, 10) || 'Product Data', 
            reviewerName: review.reviewerName || 'Customer (Product Data)'
        }));
        
        const combinedReviews = [...localReviews, ...mappedApiReviews];
        const calculatedAvg = reviewUtils.getAverageRating(combinedReviews, product.rating || 0);

        return { combinedReviews, calculatedAvg };
    };

    useEffect(() => {
        const userReviews = reviewUtils.getReviews(product.id);
        const { combinedReviews, calculatedAvg } = getCombinedReviewsAndAverage(userReviews);
        
        setReviews(combinedReviews);
        setAvgRating(calculatedAvg);
    }, [product.id, product.rating, product.reviews]); 

    const handleReviewSubmitted = (updatedUserReviews) => {
        const { combinedReviews, calculatedAvg } = getCombinedReviewsAndAverage(updatedUserReviews);
        setReviews(combinedReviews); 
        setAvgRating(calculatedAvg);
    };

    if (!product) return null;

    const discountedPrice = product.discountPercentage 
      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
      : product.price;

    const displayRating = avgRating.toFixed(2);
    const totalReviews = reviews.length;


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
                        
                        {/* Display average rating */}
                        <div className="detail-rating">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    fill={i < Math.floor(avgRating) ? '#fbbf24' : 'none'}
                                    stroke={i < Math.floor(avgRating) ? '#fbbf24' : '#d1d5db'}
                                />
                            ))}
                            <span className="rating-text">
                                **{displayRating}** ({totalReviews} reviews)
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

                        {/* Reviews Section */}
                        <div className="reviews-section">
                            <h3>Customer Reviews</h3>
                            <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
                            <div className="review-list">
                                {reviews.length === 0 ? (
                                    <p>No reviews yet. Be the first!</p>
                                ) : (
                                    reviews.map((review, index) => (
                                        <div key={index} className="review-item">
                                            <p className="review-header">
                                                <strong>{review.reviewerName}</strong>
                                                <span className="review-date">{review.date}</span>
                                            </p>
                                            <div className="review-rating-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < review.rating ? '#fbbf24' : 'none'}
                                                        stroke={i < review.rating ? '#fbbf24' : '#d1d5db'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;