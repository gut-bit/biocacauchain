import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartContextType {
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializamos a partir do localStorage para persistir reloads
  const [orderId, setOrderIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("gutcacau_b2b_order_id");
    } catch {
      return null;
    }
  });

  const setOrderId = (id: string | null) => {
    setOrderIdState(id);
    if (id) {
      localStorage.setItem("gutcacau_b2b_order_id", id);
    } else {
      localStorage.removeItem("gutcacau_b2b_order_id");
    }
  };

  const clearCart = () => {
    setOrderId(null);
  };

  return (
    <CartContext.Provider value={{ orderId, setOrderId, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
