"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { CartItem } from "./cart-context"
import { Address } from "./auth-context"

export type OrderStatus = "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled"

export interface OrderTrackingStep {
  status: OrderStatus
  timestamp: string
  description: string
  location?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  address: Address
  paymentMethod: "cod" | "upi" | "card"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: OrderStatus
  tracking: OrderTrackingStep[]
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  createdAt: string
  estimatedDelivery: string
}

interface OrderContextType {
  orders: Order[]
  createOrder: (
    items: CartItem[],
    address: Address,
    paymentMethod: "cod" | "upi" | "card",
    subtotal: number,
    discount: number,
    deliveryCharge: number
  ) => Order
  getOrderById: (orderId: string) => Order | undefined
  cancelOrder: (orderId: string) => boolean
  getUserOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => boolean
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load orders from localStorage on mount
    const storedOrders = localStorage.getItem("flipkart_orders")
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders))
      } catch {
        localStorage.removeItem("flipkart_orders")
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    // Persist orders to localStorage
    if (isInitialized) {
      localStorage.setItem("flipkart_orders", JSON.stringify(orders))
    }
  }, [orders, isInitialized])

  const createOrder = (
    items: CartItem[],
    address: Address,
    paymentMethod: "cod" | "upi" | "card",
    subtotal: number,
    discount: number,
    deliveryCharge: number
  ): Order => {
    const now = new Date()
    const estimatedDelivery = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    
    const newOrder: Order = {
      id: `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      userId: "current_user", // In real app, get from auth context
      items,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: "confirmed",
      tracking: [
        {
          status: "confirmed",
          timestamp: now.toISOString(),
          description: "Order confirmed",
          location: "FlipKart Warehouse"
        }
      ],
      subtotal,
      discount,
      deliveryCharge,
      total: subtotal - discount + deliveryCharge,
      createdAt: now.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString()
    }

    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId)
  }

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId)
    if (!order || order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
      return false
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: "cancelled" as OrderStatus,
              tracking: [
                ...o.tracking,
                {
                  status: "cancelled" as OrderStatus,
                  timestamp: new Date().toISOString(),
                  description: "Order cancelled by customer"
                }
              ]
            }
          : o
      )
    )
    return true
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): boolean => {
    const order = orders.find(o => o.id === orderId)
    if (!order || order.orderStatus === "cancelled") {
      return false
    }

    const statusDescriptions: Record<OrderStatus, string> = {
      confirmed: "Order confirmed",
      processing: "Order is being processed",
      shipped: "Order has been shipped",
      out_for_delivery: "Order is out for delivery",
      delivered: "Order delivered successfully",
      cancelled: "Order cancelled"
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              paymentStatus: newStatus === "delivered" && o.paymentMethod === "cod" ? "paid" : o.paymentStatus,
              tracking: [
                ...o.tracking,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  description: statusDescriptions[newStatus],
                  location: newStatus === "shipped" ? "Dispatch Center" : 
                           newStatus === "out_for_delivery" ? "Local Hub" :
                           newStatus === "delivered" ? o.address.city : undefined
                }
              ]
            }
          : o
      )
    )
    return true
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        cancelOrder,
        getUserOrders,
        updateOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
