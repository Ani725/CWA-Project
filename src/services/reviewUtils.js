const IN_MEMORY_REVIEWS = {}; 

const reviewUtils = {

  getReviews: (productId) => {
    return IN_MEMORY_REVIEWS[productId] || [];
  },

  addReview: (productId, review) => {
    const productReviews = IN_MEMORY_REVIEWS[productId] || [];
    
    const newReview = { 
      ...review, 
      date: new Date().toISOString().slice(0, 10), 
      reviewerName: review.reviewerName || 'Anonymous'
    };
    
    const updatedProductReviews = [newReview, ...productReviews];
    IN_MEMORY_REVIEWS[productId] = updatedProductReviews;
    
    return updatedProductReviews;
  },
  
  getAverageRating: (allReviews, existingRating) => {
    let totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    let reviewCount = allReviews.length;
    
    if (reviewCount === 0) {
        return existingRating || 0;
    }
    
    return totalRating / reviewCount;
  }
};

export default reviewUtils;