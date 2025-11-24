import React from 'react';
import { ShoppingCart } from 'lucide-react';
import StarRating from './StarRating';

const ProductCard = ({ product, onAddToCart }) => {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discountPercentage.toFixed(0)}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-1 tracking-wide">
          {product.category}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-600">({product.rating.toFixed(1)})</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
