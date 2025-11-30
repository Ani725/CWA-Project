import React, { useState, useEffect } from "react";
import cartUtils from "../services/cartUtils";
import { useNavigate, useLocation } from "react-router-dom";

const GST_RATE = 0.05; // 5%
const QST_RATE = 0.09975; // 9.975%

function Checkout({ searchTerm = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(cartUtils.getCart());
  const [exitDialogTerm, setExitDialogTerm] = useState('');
  const [exitDialogDestination, setExitDialogDestination] = useState(null);
  const prevSearchTermRef = React.useRef('');
  const didMountRef = React.useRef(false);

  // Listen to cart updates (synced from App.jsx global listener)
  useEffect(() => {
    const handler = () => setCart(cartUtils.getCart());
    window.addEventListener('cartUpdated', handler);
    return () => window.removeEventListener('cartUpdated', handler);
  }, []);

  // Redirect to home if cart is empty on page load
  useEffect(() => {
    if (cart.length === 0 && location.pathname === '/checkout') {
      navigate('/');
    }
  }, [cart, location, navigate]);

  // Show dialog when search term changes on checkout page (Enter key pressed)
  // Skip the first effect invocation on mount so that a pre-existing searchTerm
  // (for example when navigating from products to checkout) does not immediately
  // reopen the exit-confirmation dialog.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (searchTerm && searchTerm !== prevSearchTermRef.current && location.pathname === '/checkout') {
      setExitDialogTerm(searchTerm);
      setExitDialogDestination('search');
      prevSearchTermRef.current = searchTerm;
    }
  }, [searchTerm, location.pathname]);

  // Listen for header logo click event
  useEffect(() => {
    const handleHeaderLogoClick = (e) => {
      e.preventDefault();
      setExitDialogDestination('home');
      setExitDialogTerm('home');
    };

    window.addEventListener('headerLogoClick', handleHeaderLogoClick);
    return () => window.removeEventListener('headerLogoClick', handleHeaderLogoClick);
  }, []);

  const confirmExit = () => {
    if (exitDialogDestination === 'search') {
      // Apply the requested search term globally so home shows filtered results
      try {
        const ev = new CustomEvent('applySearch', { detail: exitDialogTerm });
        window.dispatchEvent(ev);
      } catch (err) {
        // ignore
      }
      navigate('/', { state: { searchTerm: exitDialogTerm } });
    } else if (exitDialogDestination === 'home') {
      navigate('/');
    }
    setExitDialogDestination(null);
    setExitDialogTerm('');
  };

  const cancelExit = () => {
    setExitDialogDestination(null);
    setExitDialogTerm('');
    prevSearchTermRef.current = '';
  };

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    payment: "credit",
  });

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  const gst = subtotal * GST_RATE;
  const qst = form.province === "Quebec" ? subtotal * QST_RATE : 0;
  const shipping = cart.length > 0 ? 5.0 : 0;
  const total = subtotal + gst + qst + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'postal') {
      // Normalize to Canadian postal code format: A1A 1A1
      const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const withSpace = raw.length > 3 ? raw.slice(0, 3) + ' ' + raw.slice(3, 6) : raw;
      setForm((prev) => ({ ...prev, [name]: withSpace }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.address || !form.city || !form.postal || !form.province) {
      alert("Please complete all required shipping address fields.");
      return;
    }

    const order = {
      id: `order_${Date.now()}`,
      items: cart,
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      qst: Number(qst.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      shippingAddress: { ...form },
      paymentMethod: form.payment,
      date: new Date().toISOString(),
    };

    // Save order to localStorage
    try {
      const raw = localStorage.getItem("orders_v1");
      const orders = raw ? JSON.parse(raw) : [];
      orders.push(order);
      localStorage.setItem("orders_v1", JSON.stringify(orders));
      // Clear cart
      localStorage.removeItem("cart");
      // Dispatch cartUpdated event so all components update
      try {
        const ev = new CustomEvent('cartUpdated', { detail: [] });
        window.dispatchEvent(ev);
      } catch (err) {
        // Fallback for older browsers
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent('cartUpdated', false, false, []);
        window.dispatchEvent(evt);
      }
    } catch (e) {
      console.error("Failed to persist order", e);
    }

    navigate("/confirmation");
  };

  return (
    <div className="page checkout-page">
      <h2 className="page-title">Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-smooth border-gray-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-semibold mb-2">Street Address *</label>
                  <input
                    id="street"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-smooth border-gray-200 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold mb-2">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-smooth border-gray-200 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-semibold mb-2">Province *</label>
                    <select
                      id="province"
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-smooth border-gray-200 focus:border-indigo-500"
                    >
                      <option value="">Select Province</option>
                      <option>Quebec</option>
                      <option>Ontario</option>
                      <option>British Columbia</option>
                      <option>Alberta</option>
                      <option>Manitoba</option>
                      <option>Saskatchewan</option>
                      <option>Nova Scotia</option>
                      <option>New Brunswick</option>
                      <option>Newfoundland and Labrador</option>
                      <option>Prince Edward Island</option>
                      <option>Northwest Territories</option>
                      <option>Yukon</option>
                      <option>Nunavut</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-semibold mb-2">Postal Code *</label>
                  <input
                    id="postalCode"
                    name="postal"
                    type="text"
                    placeholder="A1A 1A1"
                    value={form.postal}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    pattern="[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d"
                    title="Postal code format: A1A 1A1"
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-smooth border-gray-200 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-list">
              <label className={`payment-card ${form.payment === 'credit' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="credit" checked={form.payment === 'credit'} onChange={handleChange} />
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="payment-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-40zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM576 80v48H0V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48z"></path></svg>
                <span className="payment-label">Credit Card</span>
              </label>

              <label className={`payment-card ${form.payment === 'paypal' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="paypal" checked={form.payment === 'paypal'} onChange={handleChange} />
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="payment-icon paypal" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"></path></svg>
                <span className="payment-label">PayPal</span>
              </label>

              <label className={`payment-card ${form.payment === 'bank' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="bank" checked={form.payment === 'bank'} onChange={handleChange} />
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="payment-icon bank" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z"></path></svg>
                <span className="payment-label">Bank Transfer</span>
              </label>
            </div>
          </section>

          <div style={{ marginTop: 16 }}>
            <small className="muted">
              By clicking Place Order you agree to our <u>terms and conditions</u>.
            </small>
          </div>
        </form>

        <aside className="order-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((it) => (
                <div key={it.id} className="summary-item">
                  <div className="summary-item-left">
                    <img src={it.thumbnail} alt={it.title} />
                    <div className="summary-item-meta">
                      <div className="summary-item-title">{it.title}</div>
                      <div className="summary-item-qty">x{it.quantity}</div>
                    </div>
                  </div>
                  <div className="summary-item-price">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            {form.province === 'Quebec' && (
              <div className="summary-row">
                <span>QST (9.975%)</span>
                <span>${qst.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button
              onClick={handleSubmit}
              className="btn-primary btn-place-order"
            >
              Place Order
            </button>
          </div>
        </aside>
      </div>

      {/* Exit Checkout Confirmation Dialog */}
      {exitDialogDestination && (
        <div className="modal-overlay" onClick={cancelExit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>You are about to exit the checkout page.</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn-primary"
                onClick={confirmExit}
                style={{ flex: 1 }}
              >
                Continue Shopping
              </button>
              <button
                className="btn-primary"
                onClick={cancelExit}
                style={{ flex: 1, background: '#6b7280' }}
              >
                Proceed Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
