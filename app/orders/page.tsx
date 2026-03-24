"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useOrders, Order, OrderStatus } from "@/lib/orders-context"
import { formatPrice } from "@/lib/products"
import { useState } from "react"

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "Order Placed", color: "text-yellow-600 bg-yellow-50", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-50", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-600 bg-purple-50", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-600 bg-orange-50", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50", icon: XCircle },
  returned: { label: "Returned", color: "text-gray-600 bg-gray-50", icon: XCircle }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { getUserOrders } = useOrders()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/orders")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const orders = getUserOrders(user.id)
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-foreground mb-6">My Orders</h1>

      {/* Filters */}
      <div className="bg-card border border-border rounded-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or product name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-4">
            {orders.length === 0 
              ? "You haven't placed any orders yet"
              : "No orders match your search criteria"
            }
          </p>
          <Link href="/products">
            <Button className="bg-primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, formatDate }: { order: Order; formatDate: (date: string) => string }) {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-card border border-border rounded-sm hover:shadow-md transition-shadow">
        {/* Order header */}
        <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 bg-muted/30">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Order ID</span>
              <div className="text-sm font-medium">{order.id}</div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs text-muted-foreground">Placed on</span>
              <div className="text-sm">{formatDate(order.createdAt)}</div>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium ${status.color}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>
        </div>

        {/* Order items */}
        <div className="p-4">
          {order.items.map((item, index) => (
            <div key={item.id} className={`flex gap-4 ${index > 0 ? "mt-4 pt-4 border-t border-border" : ""}`}>
              <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground line-clamp-2">{item.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                <div className="text-sm font-semibold mt-1">{formatPrice(item.price * item.quantity)}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground self-center flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Order footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-bold text-foreground">{formatPrice(order.total)}</span>
          </div>
          {order.status === "shipped" && (
            <span className="text-xs text-muted-foreground">
              Expected by {formatDate(order.estimatedDelivery)}
            </span>
          )}
          {order.status === "delivered" && (
            <span className="text-xs text-green-600">
              Delivered on {formatDate(order.updatedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
