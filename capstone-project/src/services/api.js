const API_BASE_URL = 'https://dummyjson.com';

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=100`);
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
};
