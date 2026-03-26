import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// NGN thresholds: free delivery over ₦500,000 | flat ₦15,000 delivery fee
const FREE_DELIVERY_THRESHOLD = 500000;
const DELIVERY_FEE = 15000;
const VAT_RATE = 0.075;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('sovereignCart');
    return stored ? JSON.parse(stored) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sovereignCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) =>
    setCartItems(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const itemsCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const subtotal   = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping   = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax        = subtotal * VAT_RATE;
  const total      = subtotal + shipping + tax;

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      isCartOpen, setIsCartOpen,
      itemsCount, subtotal, shipping, tax, total,
      FREE_DELIVERY_THRESHOLD,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;