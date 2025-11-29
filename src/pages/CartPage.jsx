import React, { useEffect } from 'react';
import cartUtils from '../services/cartUtils';
import { Minus, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = React.useState(cartUtils.getCart());

  // Listen to cart updates (synced from App.jsx global listener)
  useEffect(() => {
    const handler = () => setCart(cartUtils.getCart());
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);

  const navigate = useNavigate();

  const handleChange = (id, delta) => {
    cartUtils.updateQuantity(id, delta);
  };

  const handleRemove = (id) => {
    cartUtils.removeFromCart(id);
  };

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0).toFixed(2);

  return (
    <div className="page cart-page">
      <h2 className="page-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="cart-row">
              <img src={item.thumbnail} alt={item.title} style={{width:80,height:80,objectFit:'cover'}} />
              <div className="cart-row-info">
                <h4>{item.title}</h4>
                <p>${item.price.toFixed(2)} each</p>
                <div className="cart-item-quantity">
                  <button onClick={() => handleChange(item.id, -1)} disabled={item.quantity<=1}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleChange(item.id, 1)}><Plus size={14} /></button>
                </div>
                <p>Item total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button className="cart-remove" onClick={() => handleRemove(item.id)}><Trash size={16} /></button>
            </div>
          ))}

          <div className="cart-summary">
            <div className="cart-summary-row"><span>Subtotal:</span><span>${subtotal}</span></div>
            <div style={{marginTop:12}}>
              <button className="btn-primary" onClick={() => navigate('/checkout')} disabled={cart.length===0}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
