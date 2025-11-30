import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ searchTerm, setSearchTerm, totalItems, openCart, currentPath, onCheckoutSearchEnter }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Local input while on checkout so typing doesn't update global searchTerm
  const [localInput, setLocalInput] = useState(searchTerm || '');

  // Keep local input in sync when global searchTerm changes (but avoid
  // overwriting while typing on checkout).
  useEffect(() => {
    if (currentPath !== '/checkout') {
      setLocalInput(searchTerm || '');
    }
  }, [searchTerm, currentPath]);

  // Listen for clearSearch events so the header input clears immediately
  useEffect(() => {
    const handleClear = () => setLocalInput('');
    window.addEventListener('clearSearch', handleClear);
    return () => window.removeEventListener('clearSearch', handleClear);
  }, []);

  const handleLogoClick = () => {
    // Dispatch custom event so Checkout can intercept if needed
    const event = new CustomEvent('headerLogoClick', { detail: { navigateTo: '/' } });
    window.dispatchEvent(event);

    // Only navigate immediately if not on checkout, otherwise let Checkout handle it
    if (currentPath !== '/checkout') {
      navigate('/');
      setSearchTerm('');
    }
  };



  const handleSearchChange = (e) => {
    const term = e.target.value;
    if (currentPath === '/checkout') {
      setLocalInput(term);
    } else {
      setSearchTerm(term);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    // If on checkout page, use the special checkout handler (it shows a dialog)
    if (currentPath === '/checkout' && onCheckoutSearchEnter) {
      onCheckoutSearchEnter(localInput);
      return;
    }

    // Otherwise set the global search term and navigate to home to show results
    setSearchTerm(searchTerm);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 style={{ cursor: 'pointer' }} onClick={handleLogoClick}>CST Store</h1>

        {/* Search Bar */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={currentPath === '/checkout' ? localInput : searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          {(currentPath === '/checkout' ? localInput : searchTerm) && (
            <button
              className="clear-search"
              onClick={() => {
                if (currentPath === '/checkout') setLocalInput('');
                else setSearchTerm('');
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Cart Button */}
        <button className="cart-button" onClick={openCart}>
          <ShoppingCart size={24} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>
    </header>
  );
}

export default Header;
