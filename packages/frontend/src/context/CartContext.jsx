// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import productos from '../services/productos';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const cleanCart = () => setCartItems([]);

  const addItemToCart = (producto, cantidad) => {
    const itemInCart = cartItems.find(
      (item) => item.nombre === producto.nombre && item.productoId == producto._id
    );

    if (itemInCart) {
      setCartItems(
        cartItems.map((itemPedido) =>
          (itemPedido.nombre === producto.nombre && itemPedido.productoId === producto._id)
            ? { ...itemPedido, cantidad: itemPedido.cantidad + cantidad }
            : itemPedido
        )
      );
    } else {
      const newItemPedido = { productoId: producto._id, nombre: producto.titulo, cantidad, precioUnitario: producto.precio };
      setCartItems([...cartItems, newItemPedido]);
    }
  };

  const totalCart = cartItems.reduce(
    (total, itemPedido) => Number(total) + Number(itemPedido.cantidad),
    0
  );

  const totalValueCart = cartItems.reduce(
    (total, itemPedido) => Number(total) + Number(itemPedido.precioUnitario * itemPedido.cantidad),
    0
  ) 

  const removeItem = (productoId) => {
    setCartItems(cartItems.filter((item) => item.productoId !== productoId));
  };

  // 5. El valor que proveeremos a los componentes hijos
  const value = {
    cartItems,
    addItemToCart,
    totalCart,
    totalValueCart,
    cleanCart,
    removeItem
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};