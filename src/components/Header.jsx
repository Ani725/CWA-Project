import React from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';

function Header({ searchTerm, setSearchTerm, totalItems, openCart }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>CST Store</h1>

        {/* Search Bar */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
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
