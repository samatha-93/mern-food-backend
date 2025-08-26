import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const exist = cartItems.find(i => i.food === item._id);
    if (exist) {
      setCartItems(cartItems.map(i => 
        i.food === item._id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, qty: 1, food: item._id }]);
    }
  };

  const increaseQty = (id) => {
    setCartItems(cartItems.map(i =>
      i.food === id ? { ...i, qty: i.qty + 1 } : i
    ));
  };

  const decreaseQty = (id) => {
    setCartItems(cartItems.map(i =>
      i.food === id ? { ...i, qty: i.qty > 1 ? i.qty - 1 : 1 } : i
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(i => i.food !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQty, decreaseQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
