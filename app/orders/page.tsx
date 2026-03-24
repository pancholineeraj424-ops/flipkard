"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, ChevronRight, Search, Filter, ShoppingBag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders, OrderStatus } from "@/lib/order-context"
import { formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  confirmed: { bg: "bg-blue-100", text: "text-blue-700" },
  processing: { bg: "bg-yellow-100", text: "text-yellow-700" },
  shipped: { bg: "bg-purple-100", text: "text-purple-700" },
  out_for_delivery: { bg: "bg-orange-100", text: "text-orange-700" },
  delivered: { bg: "bg-green-100", text: "text-green-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" }
}

const statusLabels: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled"
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { orders } = useOrders()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/profile" className="hover:text-primary">My Account</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Orders</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="bg-card border border-border rounded-sm overflow-hidden sticky top-20">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hello,</p>
                    <p className="font-semibold text-sm">{user.name}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm bg-primary/10 text-primary font-medium"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-muted-foreground hover:bg-muted"
                >
                  Account Settings
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-muted-foreground hover:bg-muted"
                >
                  My Wishlist
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-3">
            {/* Header */}
            <div className="bg-card border border-border rounded-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-lg font-bold">My Orders</h1>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-9 h-9"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Orders list */}
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-sm p-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h2 className="text-lg font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Looks like you haven't placed any orders yet.
                </p>
                <Link href="/products">
                  <Button className="bg-[#fb641b] hover:bg-[#e85a19]">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const statusStyle = statusColors[order.orderStatus]
                  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })

                  return (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="block bg-card border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">Order ID:</span>
                            <span className="text-sm font-bold">{order.id}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Placed on {orderDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusLabels[order.orderStatus]}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex flex-wrap gap-3">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden flex-shrink-0"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                              {item.quantity > 1 && (
                                <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-1">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-16 bg-muted rounded-sm flex items-center justify-center text-sm font-medium text-muted-foreground">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div>
                            <span className="text-xs text-muted-foreground">
                              {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid"})
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
