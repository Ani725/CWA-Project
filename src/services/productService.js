const productService = {
  getAllProducts: async () => {
    // Fetches the main product list
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    return data.products;
  },
  
  getCategories: async () => {
    // Fetches the list of categories (should return an array of strings)
    const response = await fetch('https://dummyjson.com/products/categories');
    return response.json(); 
  }
};

export default productService;