import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Header = ({ cartCount }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">ShopHub</h1>
            <p className="text-sm text-gray-500">Your one-stop shop</p>
          </div>
          
          <button className="relative p-3 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart size={28} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
