import React, { createContext, useContext, useState } from "react";
import { orderApi } from "../services/api";
import type { Order } from "../types";
import { useAuth } from "./AuthContext";

interface OrderContextType {
  orders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await orderApi.getUserOrders();
      // Server returns { success, message, orders }
      const ordersData = (response as any).orders || response.data || [];
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderApi.getAllOrders();
      // Server returns { success, message, orders }
      const ordersData = (response as any).orders || response.data || [];
      setAllOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch all orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderApi.getOrderById(id);
      // Server returns { success, message, order }
      const orderData = (response as any).order || response.data || null;
      return orderData;
    } catch (err) {
      setError("Failed to fetch order");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderApi.updateOrderStatus(orderId, status);
      // Refresh orders after update
      await fetchAllOrders();
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        allOrders,
        isLoading,
        error,
        fetchUserOrders,
        fetchAllOrders,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
