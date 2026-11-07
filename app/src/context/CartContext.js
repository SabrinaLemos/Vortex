import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vortex_cart');
      return saved ? JSON.parse(saved) : [
        // Pre-populando com 2 itens iniciais para combinar com a badge da Navbar
        {
          id: 1,
          sku: 'VRT-FOX-NFC',
          title: 'Chaveiro Mascote Fox Vórtex com NFC NTAG213 Integrado',
          price: 42.90,
          quantity: 1,
          selectedColor: 'Laranja Vórtex',
          imageUrl: '/assets/prod-chaveiro-fox-nfc.png',
        },
        {
          id: 6,
          sku: 'VRT-MGS-STD',
          title: 'Suporte Ergonômico MagSafe Articulado para Mesa & Monitor',
          price: 39.90,
          quantity: 1,
          selectedColor: 'Grafite Stealth',
          imageUrl: '/assets/prod-suporte-magsafe.png',
        }
      ];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('vortex_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            sku: product.sku,
            title: product.title,
            price: product.price,
            quantity,
            selectedColor: selectedColor || (product.colors?.[0]?.name ?? 'Padrão'),
            imageUrl: product.imageUrl,
          },
        ];
      }
    });

    setNotification(`"${product.title.split(' ')[0]}..." adicionado ao carrinho!`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
