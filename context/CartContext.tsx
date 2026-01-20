'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  variant: string;
  note?: string;
  image?: string;
}

export interface Order {
  id: number;
  customerName: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed';
  createdAt: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartQty: (index: number, newQty: number) => void;
  clearCart: () => void;
  confirmOrder: (customerName: string) => Promise<void>;
  removeOrder: (id: number) => Promise<void>;
  markAsPaid: (id: number) => Promise<void>;
}

const API_URL = 'https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/orders';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadOrdersFromBackend = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        const data = await res.json();
        const validatedOrders = data.map((order: any) => ({
          ...order,
          total: Number(order.total),
          id: Number(order.id),
        }));
        setOrders(validatedOrders);
      }
    } catch (e) {
      console.warn("Syncing: Menunggu backend...");
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cafe_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    loadOrdersFromBackend();
    setIsInitialized(true);
    const interval = setInterval(loadOrdersFromBackend, 5000);
    return () => clearInterval(interval);
  }, [loadOrdersFromBackend]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('cafe_cart', JSON.stringify(cart));
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(i => i.id === item.id && i.variant === item.variant);
      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx].qty += item.qty;
        return newCart;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));

  const updateCartQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].qty = newQty;
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const confirmOrder = async (customerName: string) => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          customerName,
          total,
          items: cart.map(item => ({
            menuId: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            variant: item.variant,
            note: item.note || "" 
          }))
        })
      });
      if (res.ok) {
        setCart([]);
        localStorage.removeItem('cafe_cart');
        await loadOrdersFromBackend();
      }
    } catch (e) {
      alert("Gagal terhubung ke server.");
    }
  };

  const removeOrder = async (id: number) => {
    if (!confirm("Hapus pesanan ini?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) await loadOrdersFromBackend();
    } catch (e) { console.error(e); }
  };

  const markAsPaid = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (res.ok) {
        await loadOrdersFromBackend(); // Refresh data setelah bayar
      }
    } catch (e) { console.error(e); }
  };

  return (
    <CartContext.Provider value={{ cart, orders, addToCart, removeFromCart, updateCartQty, clearCart, confirmOrder, removeOrder, markAsPaid }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};