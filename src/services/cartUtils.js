const cartUtils = {
  getCart: () => {
    try {
      // 1. Get the raw string from localStorage
      const cartString = localStorage.getItem('cart');

      // 2. Safely parse it. If null, empty, or fails parsing, return an empty array.
      // If cartString is null or undefined, JSON.parse(null) is null. 
      // The coalesce operator (??) ensures we default to an empty array.
      const cartData = cartString ? JSON.parse(cartString) : null;
      
      // Ensure the result is an array before returning it
      return Array.isArray(cartData) ? cartData : [];

    } catch (e) {
      // If parsing fails (e.g., corrupted storage), log the error and return an empty array.
      console.error("Could not parse cart data from localStorage, resetting cart:", e);
      // This ensures the value of 'cart' is ALWAYS an array, preventing the .reduce() error.
      return []; 
    }
  },

  saveCart: (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  addToCart: (product) => {
    const cart = cartUtils.getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // FIX: Only push essential properties for the cart item
      cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1
      });
    }

    cartUtils.saveCart(cart);
    return cart;
  },

  removeFromCart: (productId) => {
    const cart = cartUtils.getCart();
    const updatedCart = cart.filter((item) => item.id !== productId);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  updateQuantity: (productId, quantityChange) => {
    const cart = cartUtils.getCart();
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        item.quantity = Math.max(1, item.quantity + quantityChange);
      }
      return item;
    });

    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },
};

export default cartUtils;