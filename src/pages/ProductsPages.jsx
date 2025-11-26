import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

function ProductsPage({
  searchTerm,
  selectedCategory,
  priceRange,
  sortBy,
  onAddToCart,
  onViewDetails,
}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        console.log("Loaded products:", productsData);  // Debugging log
        setLoading(false);
      } catch (error) {
        console.error("Failed to load products:", error);
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Apply filters when products or filter criteria change
  useEffect(() => {
    if (!products || products.length === 0) return;
    applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Filter the products based on search term, category, price range, and sort
  const applyFilters = () => {
    console.log("Applying filters...");

    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter - Check if category is 'all' or match product category
    if (selectedCategory && selectedCategory !== 'all') {
      console.log("Filtering by category:", selectedCategory);  // Debugging log
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())  // Fixed to include partial matches for debugging
      );
    }

    // Price range filter
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Sorting by price
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    console.log("Filtered products:", filtered);  // Debugging log
    setFilteredProducts(filtered);
  };

  // Loading state
  if (loading) {
    return <div className="loading">Loading Products...</div>;
  }

  // No results found state
  if (filteredProducts.length === 0 && products.length > 0) {
    return (
      <div className="no-results">
        <h2 className="page-title">All Products</h2>
        <p>No products found matching your current filters.</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="results-header">
        <h2 className="page-title">All Products</h2>
        <span className="results-count">{filteredProducts.length} results</span>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
