const reviewUtils = {
  getReviews: (productId) => {
    // This can fetch reviews from an API or return mock data
    return [
      {
        reviewerName: 'John Doe',
        rating: 5,
        comment: 'Great product!',
        date: '2021-12-01',
      },
      {
        reviewerName: 'Jane Smith',
        rating: 4,
        comment: 'Really good, but could be improved.',
        date: '2021-12-02',
      },
    ];
  },

  addReview: (productId, review) => {
    // Add a new review to a product (this can send data to an API)
    console.log('Adding review', review);
  },
};

export default reviewUtils;
