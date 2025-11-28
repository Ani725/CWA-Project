// reviewUtils.js

const LOCAL_STORAGE_KEY = 'userReviews';

const reviewUtils = {
  // Mock data (simulating API reviews)
  getMockReviews: (productId) => {
    // Only return mock reviews for a specific product for a clearer example
    if (productId === 1) { 
      return [
        { reviewerName: 'John Doe (API)', rating: 5, comment: 'Great product!', date: '2021-12-01' },
        { reviewerName: 'Jane Smith (API)', rating: 4, comment: 'Really good, but could be improved.', date: '2021-12-02' },
      ];
    }
    return [];
  },

  // Get user-submitted reviews from localStorage
  getUserReviews: () => {
    try {
      const reviews = localStorage.getItem(LOCAL_STORAGE_KEY);
      return reviews ? JSON.parse(reviews) : {};
    } catch (e) {
      console.error("Could not parse user reviews from localStorage.", e);
      return {};
    }
  },

  // Save all user-submitted reviews to localStorage
  saveUserReviews: (allReviews) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allReviews));
  },

  // Combined function to get all reviews for a product
  getReviews: (productId) => {
    const mockReviews = reviewUtils.getMockReviews(productId);
    const allUserReviews = reviewUtils.getUserReviews();
    const productUserReviews = allUserReviews[productId] || [];
    
    // Combine API/Mock reviews and User-submitted reviews
    return [...mockReviews, ...productUserReviews];
  },

  // Function to add a new review
  addReview: (productId, review) => {
    const allUserReviews = reviewUtils.getUserReviews();
    const productReviews = allUserReviews[productId] || [];
    
    // Add the new review
    const newReview = { 
        ...review, 
        date: new Date().toISOString().slice(0, 10), // Set current date
        reviewerName: review.reviewerName || 'Anonymous'
    };
    
    const updatedProductReviews = [newReview, ...productReviews];
    allUserReviews[productId] = updatedProductReviews;
    
    reviewUtils.saveUserReviews(allUserReviews);
    
    // Return all reviews for the product for immediate state update
    return [...reviewUtils.getMockReviews(productId), ...updatedProductReviews];
  },
  
  // New function to calculate average rating
  getAverageRating: (productId, existingRating) => {
    const allReviews = reviewUtils.getReviews(productId);
    
    // Include the existing API/product rating as a "seed" if no user reviews exist
    // This uses the product's default rating and a count from the API (e.g., product.reviews?.length)
    // For simplicity, we'll assume the base product rating already contributes to the average
    let totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    let reviewCount = allReviews.length;
    
    // If no reviews at all, return the existing product rating, or 0
    if (reviewCount === 0) {
        return existingRating || 0;
    }
    
    return totalRating / reviewCount;
  }
};

export default reviewUtils;