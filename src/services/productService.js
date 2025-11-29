const productService = {
  getAllProducts: async () => {
    // Fetch products from a dummy API
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    return data.products;
  },

  getCategories: async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    return response.json();
  }
};

export default productService;

// Add helper to fetch a single product by id
productService.getProductById = async (id) => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to fetch product by id', e);
    throw e;
  }
};
