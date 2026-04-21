"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  id: string; // id único del carrito (puede ser `${id_establecimiento}-${id_producto}`)
  id_producto: number;
  id_establecimiento: number;

  name: string;
  price: number; // euros
  qty: number;
  image?: string;
};

type CartState = { items: CartItem[] };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totals: { count: number; subtotal: number };
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "close4u_cart_v1";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

type Action =
  | { type: "SET_ALL"; items: CartItem[] }
  | { type: "ADD"; item: Omit<CartItem, "qty">; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_ALL":
      return { items: action.items };

    case "ADD": {
      const qty = Math.max(1, Number(action.qty) || 1);
      const idx = state.items.findIndex((i) => i.id === action.item.id);

      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return { items: next };
      }

      return { items: [...state.items, { ...action.item, qty }] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "SET_QTY": {
      const qty = Math.max(1, Number(action.qty) || 1);
      return { items: state.items.map((i) => (i.id === action.id ? { ...i, qty } : i)) };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    dispatch({ type: "SET_ALL", items: loadCart() });
  }, []);

  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totals = {
      count: state.items.reduce((a, i) => a + i.qty, 0),
      subtotal: state.items.reduce((a, i) => a + i.qty * i.price, 0),
    };

    return {
      items: state.items,
      addItem: (item, qty = 1) => dispatch({ type: "ADD", item, qty }),
      removeItem: (id) => dispatch({ type: "REMOVE", id }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
      totals,
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider />");
  return ctx;
}

export function formatEUR(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}