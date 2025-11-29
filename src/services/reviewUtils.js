const STORAGE_KEY = 'reviews_v1';

function loadAllReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return (data && typeof data === 'object') ? data : {};
  } catch (e) {
    console.error('Failed to load reviews from localStorage:', e);
    return {};
  }
}

function saveAllReviews(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error('Failed to save reviews to localStorage:', e);
  }
}

const reviewUtils = {
  getReviews: (productId) => {
    const all = loadAllReviews();
    const list = all[productId];
    return Array.isArray(list) ? list : [];
  },

  addReview: (productId, review) => {
    const all = loadAllReviews();
    const existing = Array.isArray(all[productId]) ? all[productId] : [];

    const newReview = {
      ...review,
      date: new Date().toISOString().slice(0, 10),
      reviewerName: review.reviewerName || 'Anonymous',
    };

    const updated = [newReview, ...existing];
    all[productId] = updated;
    saveAllReviews(all);
    return updated;
  },

  getAverageRating: (allReviews, existingRating) => {
    if (!Array.isArray(allReviews) || allReviews.length === 0) {
      return existingRating || 0;
    }

    const total = allReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    return total / allReviews.length;
  },
};

export default reviewUtils;