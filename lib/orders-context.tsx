"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { CartItem } from "./cart-context"
import { Address } from "./auth-context"

export type OrderStatus = 
  | "pending"
  | "confirmed" 
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"

export interface OrderTracking {
  status: OrderStatus
  timestamp: string
  location?: string
  description: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  address: Address
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: OrderStatus
  tracking: OrderTracking[]
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "tracking">) => Order
  getOrderById: (id: string) => Order | undefined
  getUserOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus, description?: string) => void
  cancelOrder: (orderId: string) => boolean
  getAllOrders: () => Order[]
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

// Demo orders for testing
const initialOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-1",
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 134999,
        originalPrice: 159999,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
        category: "electronics",
        rating: 4.7,
        reviews: 12543,
        description: "Experience the pinnacle of smartphone technology",
        features: ["A17 Pro chip"],
        inStock: true,
        quantity: 1
      }
    ],
    address: {
      id: "addr-1",
      name: "Rahul Sharma",
      phone: "9876543210",
      pincode: "110001",
      locality: "Connaught Place",
      address: "123, Block A, Inner Circle",
      city: "New Delhi",
      state: "Delhi",
      type: "home",
      isDefault: true
    },
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "shipped",
    tracking: [
      {
        status: "pending",
        timestamp: "2026-03-20T10:00:00Z",
        description: "Order placed successfully"
      },
      {
        status: "confirmed",
        timestamp: "2026-03-20T10:30:00Z",
        description: "Order confirmed by seller"
      },
      {
        status: "processing",
        timestamp: "2026-03-20T14:00:00Z",
        location: "Delhi Warehouse",
        description: "Order is being processed"
      },
      {
        status: "shipped",
        timestamp: "2026-03-21T09:00:00Z",
        location: "Delhi Hub",
        description: "Package shipped via Flipkard Express"
      }
    ],
    subtotal: 134999,
    discount: 5000,
    deliveryCharge: 0,
    total: 129999,
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-21T09:00:00Z",
    estimatedDelivery: "2026-03-25"
  },
  {
    id: "ORD-002",
    userId: "user-1",
    items: [
      {
        id: "3",
        name: "Sony WH-1000XM5 Headphones",
        price: 24990,
        originalPrice: 34990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        category: "electronics",
        rating: 4.8,
        reviews: 5621,
        description: "Industry-leading noise cancellation",
        features: ["30-hour battery"],
        inStock: true,
        quantity: 1
      }
    ],
    address: {
      id: "addr-1",
      name: "Rahul Sharma",
      phone: "9876543210",
      pincode: "110001",
      locality: "Connaught Place",
      address: "123, Block A, Inner Circle",
      city: "New Delhi",
      state: "Delhi",
      type: "home",
      isDefault: true
    },
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "delivered",
    tracking: [
      {
        status: "pending",
        timestamp: "2026-03-15T10:00:00Z",
        description: "Order placed successfully"
      },
      {
        status: "confirmed",
        timestamp: "2026-03-15T10:30:00Z",
        description: "Order confirmed by seller"
      },
      {
        status: "processing",
        timestamp: "2026-03-15T14:00:00Z",
        location: "Mumbai Warehouse",
        description: "Order is being processed"
      },
      {
        status: "shipped",
        timestamp: "2026-03-16T09:00:00Z",
        location: "Mumbai Hub",
        description: "Package shipped"
      },
      {
        status: "out_for_delivery",
        timestamp: "2026-03-18T08:00:00Z",
        location: "New Delhi",
        description: "Out for delivery"
      },
      {
        status: "delivered",
        timestamp: "2026-03-18T14:30:00Z",
        location: "New Delhi",
        description: "Delivered to customer"
      }
    ],
    subtotal: 24990,
    discount: 0,
    deliveryCharge: 0,
    total: 24990,
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-18T14:30:00Z",
    estimatedDelivery: "2026-03-19"
  }
]

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("flipkard_orders")
    if (stored) {
      setOrders(JSON.parse(stored))
    } else {
      setOrders(initialOrders)
      localStorage.setItem("flipkard_orders", JSON.stringify(initialOrders))
    }
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("flipkard_orders", JSON.stringify(orders))
    }
  }, [orders])

  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "tracking">): Order => {
    const now = new Date().toISOString()
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: now,
      updatedAt: now,
      tracking: [
        {
          status: "pending",
          timestamp: now,
          description: "Order placed successfully"
        }
      ]
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id)
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId)
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus, description?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newTracking: OrderTracking = {
          status,
          timestamp: new Date().toISOString(),
          description: description || getDefaultDescription(status)
        }
        return {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
          tracking: [...order.tracking, newTracking]
        }
      }
      return order
    }))
  }

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return false
    
    // Can only cancel if not yet shipped
    if (["shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      return false
    }
    
    updateOrderStatus(orderId, "cancelled", "Order cancelled by customer")
    return true
  }

  const getAllOrders = (): Order[] => {
    return orders
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
        cancelOrder,
        getAllOrders
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

function getDefaultDescription(status: OrderStatus): string {
  const descriptions: Record<OrderStatus, string> = {
    pending: "Order placed successfully",
    confirmed: "Order confirmed by seller",
    processing: "Order is being processed",
    shipped: "Package shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered successfully",
    cancelled: "Order cancelled",
    returned: "Order returned"
  }
  return descriptions[status]
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
