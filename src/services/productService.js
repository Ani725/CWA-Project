const productService = {
  getAllProducts: async () => {
    // Fetch ALL products (190+), including beauty, kitchen, mobile, etc.
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
