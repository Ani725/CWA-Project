import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductDetail from '../components/ProductDetail';

function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="no-results">Product not found.</div>;

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="btn-back">Back</button>
      <ProductDetail product={product} onClose={() => navigate(-1)} onAddToCart={onAddToCart} />
    </div>
  );
}

export default ProductDetailPage;
