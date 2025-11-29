import React from 'react';
import { X, ShoppingCart, Minus, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ShoppingCartPanel({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) {
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ).toFixed(2);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shipping = totalItems > 0 ? 5.00 : 0.00; 
  const total = (parseFloat(subtotal) + shipping).toFixed(2);

  const navigate = useNavigate();

  const handleProceed = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart ({totalItems} items)</h2>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} strokeWidth={1.5} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.thumbnail} alt={item.title} />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="cart-item-total">
                    Item Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <button 
                  className="cart-item-remove" 
                  onClick={() => onRemove(item.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-footer">
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>
          <button className="btn-checkout" disabled={cart.length === 0} onClick={handleProceed}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default ShoppingCartPanel;
