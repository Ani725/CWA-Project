const cartUtils = {
  getCart: () => {
    try {
      const cart = localStorage.getItem('cart');
      // FIX: Add try...catch block to safely parse corrupted localStorage data
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error("Could not parse cart data from localStorage, resetting cart:", e);
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