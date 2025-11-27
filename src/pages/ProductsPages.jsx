import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

// NOTE: The manual categoryMap has been removed. 
// The filtering logic below is now robust and does not require it.

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

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Re-apply filters when needed
  useEffect(() => {
    if (products.length > 0) applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);


  // 🧠 MAIN FILTERING LOGIC
  const applyFilters = () => {
    let filtered = [...products];

    // Search filter (Case-insensitive)
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (Case-insensitive & handles space/hyphen inconsistency)
    if (selectedCategory && selectedCategory !== "all") {
      
      // Normalize the selected filter value (e.g., 'Home Decoration' -> 'home decoration')
      const normalizedFilter = selectedCategory.toLowerCase().replace(/-/g, ' '); 
      
      filtered = filtered.filter((product) => {
        // Normalize the product's category string (e.g., 'home-decoration' -> 'home decoration')
        const normalizedProductCategory = product.category.toLowerCase().replace(/-/g, ' ');
        
        // Compare the normalized strings
        return normalizedProductCategory === normalizedFilter;
      });
    }

    // Price filter
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] &&
          product.price <= priceRange[1]
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };


  if (loading) {
    return <div className="loading">Loading Products...</div>;
  }

  if (filteredProducts.length === 0 && products.length > 0) {
    return (
      <div className="no-results">
        <h2 className="page-title">All Products</h2>
        <p>No products found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="results-header">
        <h2 className="page-title">All Products</h2>
        <span className="results-count">
          {filteredProducts.length} results
        </span>
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