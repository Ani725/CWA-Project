import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    alert(`${product.title} added to cart!`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header cartCount={cartCount} />
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading products...</div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                All Products
              </h2>
              <p className="text-gray-600">
                Showing {products.length} products
              </p>
            </div>
            
            <ProductGrid 
              products={products}
              onAddToCart={handleAddToCart}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ProductListingPage;
