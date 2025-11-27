import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductsPages from './pages/ProductsPages'; // <-- FIX: Changed to ProductsPages
import ShoppingCartPanel from './components/ShoppingCartPanel';
import ProductDetail from './components/ProductDetail';
import cartUtils from './services/cartUtils';
import productService from './services/productService';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(cartUtils.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [appError, setAppError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Load categories on startup
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();

        // Log the API response to inspect its structure
        console.log('Categories API response:', cats);

        // Ensure 'cats' is an array before setting state
        const categoriesArray = Array.isArray(cats) ? cats : [];

        // If categories are objects, extract the category name or slug (e.g., in case the API format changes)
        if (categoriesArray.length > 0 && typeof categoriesArray[0] === 'object') {
          // Extract category name or slug from the object
          const formattedCategories = categoriesArray.map(cat => cat.name || cat.slug || '');
          setCategories(['all', ...formattedCategories]); // Prepend "all"
        } else {
          setCategories(['all', ...categoriesArray]); // Prepend "all"
        }

        setAppError(null);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setAppError("Failed to load initial data. Check network and API service.");
      }
    };
    loadCategories();
  }, []);

  const updateCart = (newCart) => {
    cartUtils.saveCart(newCart);
    setCart(newCart);
  };

  const handleAddToCart = (product) => {
    const updatedCart = cartUtils.addToCart(product);
    updateCart(updatedCart);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    updateCart(updatedCart);
  };

  const handleUpdateQuantity = (productId, change) => {
    const updatedCart = cartUtils.updateQuantity(productId, change);
    updateCart(updatedCart);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (appError) {
    return (
      <div className="error-screen" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Application Error</h2>
        <p>{appError}</p>
        <p>Please check your browser console for details.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalItems={totalItems}
        openCart={() => setIsCartOpen(true)}
      />

      <main className="main-content">
        <div className="filters-section">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {/* Logic to safely render category strings */}
            {categories.map((cat, index) => {
              if (typeof cat !== 'string' || cat.length === 0) {
                return null;
              }

              const displayLabel = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');

              return (
                <option key={index} value={cat}>
                  {displayLabel}
                </option>
              );
            })}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <ProductsPages // <-- FIX: Component name changed to ProductsPages
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          sortBy={sortBy}
          onAddToCart={handleAddToCart}
          onViewDetails={setSelectedProduct}
        />
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <ShoppingCartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
}

export default App;