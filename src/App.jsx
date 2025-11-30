import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProductsPages from './pages/ProductsPages'; 
import ShoppingCartPanel from './components/ShoppingCartPanel';
import ProductDetail from './components/ProductDetail';
import { Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer';
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

  // Listen for cart updates from cartUtils.saveCart or other components
  useEffect(() => {
    const handleCartUpdate = (e) => {
      try {
        const updated = (e && e.detail) ? e.detail : cartUtils.getCart();
        setCart(Array.isArray(updated) ? updated : cartUtils.getCart());
      } catch (err) {
        setCart(cartUtils.getCart());
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Also listen for storage events from other tabs
    const handleStorageUpdate = (ev) => {
      if (ev.key === 'cart') {
        setCart(cartUtils.getCart());
      }
    };
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Listen for a request to clear the global search term
  useEffect(() => {
    const handleClearSearch = () => setSearchTerm('');
    window.addEventListener('clearSearch', handleClearSearch);
    return () => window.removeEventListener('clearSearch', handleClearSearch);
  }, []);

  // Listen for a request to apply a search term globally (e.g., from Checkout)
  useEffect(() => {
    const handleApplySearch = (e) => {
      const t = e && e.detail ? String(e.detail) : '';
      setSearchTerm(t);
    };
    window.addEventListener('applySearch', handleApplySearch);
    return () => window.removeEventListener('applySearch', handleApplySearch);
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

  const handleSearchOnCheckout = (term) => {
    if (location.pathname === '/checkout' && term) {
      setSearchTerm(term);
      // Dialog will be shown in Checkout component when search changes
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();

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
        currentPath={location.pathname}
        onCheckoutSearchEnter={handleSearchOnCheckout}
      />

      <main className="main-content">
        {location.pathname === '/' && (
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
        )}

        <Routes>
          <Route path="/" element={
            <ProductsPages
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
              onAddToCart={handleAddToCart}
              onViewDetails={setSelectedProduct}
            />
          } />

          <Route path="/product/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
          <Route path="/checkout" element={<Checkout searchTerm={searchTerm} />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>

      <Footer />

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