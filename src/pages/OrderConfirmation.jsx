import React from 'react';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const ordersRaw = localStorage.getItem('orders_v1');
  const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
  const last = orders.length > 0 ? orders[orders.length - 1] : null;

  if (!last) {
    return (
      <div className="page confirmation-page">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">No recent order found</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page confirmation-page">
      <div className="confirmation-card glass rounded-2xl p-6">
        <div className="order-header">
          <h2 className="text-2xl font-bold mb-2">Thank you for your order!</h2>
          <div className="muted">Order ID: <strong>{last.id}</strong></div>
          <div className="muted">Placed: {new Date(last.date).toLocaleString()}</div>
        </div>

        <section className="shipping mt-6">
          <h3 className="block text-sm font-semibold mb-2">Shipping Address</h3>
          <div>{last.shippingAddress.name}</div>
          <div>{last.shippingAddress.address}</div>
          <div>{last.shippingAddress.city}, {last.shippingAddress.province} {last.shippingAddress.postal}</div>
        </section>

        <section className="items mt-6">
          <h3 className="block text-sm font-semibold mb-2">Items</h3>
          <div className="order-items">
            {last.items.map(it => (
              <div key={it.id} className="order-item">
                <div className="order-item-left">
                  <img src={it.thumbnail} alt={it.title} />
                </div>
                <div className="order-item-mid">
                  <div className="order-item-title">{it.title}</div>
                  <div className="order-item-qty">x{it.quantity}</div>
                </div>
                <div className="order-item-price">${ (it.price * it.quantity).toFixed(2) }</div>
              </div>
            ))}
          </div>
        </section>

        <div className="order-totals mt-6">
          <div className="summary-row"><span>Subtotal</span><span>${last.subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>GST</span><span>${last.gst.toFixed(2)}</span></div>
          {last.qst > 0 && <div className="summary-row"><span>QST</span><span>${last.qst.toFixed(2)}</span></div>}
          <div className="summary-row"><span>Shipping</span><span>${last.shipping.toFixed(2)}</span></div>
          <div className="summary-row total"><strong>Total</strong><strong>${last.total.toFixed(2)}</strong></div>
        </div>

        <section className="payment mt-6">
          <h3 className="block text-sm font-semibold mb-2">Payment</h3>
          <p className="muted">{last.paymentMethod}</p>
        </section>

        <div className="mt-6">
          <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
