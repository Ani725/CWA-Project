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
