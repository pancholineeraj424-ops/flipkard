"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  ChevronRight,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Circle,
  XCircle,
  ArrowLeft,
  Phone,
  Download,
  RotateCcw,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders, OrderStatus } from "@/lib/order-context"
import { formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const statusConfig: Record<OrderStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  confirmed: { icon: CheckCircle2, color: "text-blue-600", label: "Order Confirmed" },
  processing: { icon: Package, color: "text-yellow-600", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-600", label: "Shipped" },
  out_for_delivery: { icon: Truck, color: "text-orange-600", label: "Out for Delivery" },
  delivered: { icon: CheckCircle2, color: "text-green-600", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600", label: "Cancelled" }
}

const trackingSteps: OrderStatus[] = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { getOrderById, cancelOrder } = useOrders()

  const order = getOrderById(params.id as string)

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

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="bg-white rounded-sm p-8 text-center max-w-md mx-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-xl font-bold mb-2">Order not found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = trackingSteps.indexOf(order.orderStatus)
  const isCancelled = order.orderStatus === "cancelled"
  const canCancel = !isCancelled && order.orderStatus !== "delivered" && order.orderStatus !== "out_for_delivery"

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  const estimatedDate = new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  const handleCancelOrder = () => {
    if (cancelOrder(order.id)) {
      toast.success("Order cancelled successfully")
    } else {
      toast.error("Unable to cancel order")
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/orders" className="hover:text-primary">Orders</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{order.id}</span>
        </nav>

        {/* Back button */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Main content */}
          <div className="space-y-4">
            {/* Order header */}
            <div className="bg-card border border-border rounded-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-lg font-bold mb-1">Order #{order.id}</h1>
                  <p className="text-sm text-muted-foreground">Placed on {orderDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {canCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelOrder}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                </div>
              </div>

              {/* Status badge */}
              {(() => {
                const config = statusConfig[order.orderStatus]
                const Icon = config.icon
                return (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-muted ${config.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{config.label}</span>
                  </div>
                )
              })()}
            </div>

            {/* Order tracking */}
            {!isCancelled && (
              <div className="bg-card border border-border rounded-sm p-5">
                <h2 className="font-bold mb-4">Order Tracking</h2>

                {/* Progress bar */}
                <div className="relative mb-6">
                  <div className="flex justify-between mb-2">
                    {trackingSteps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex
                      const isCurrent = index === currentStepIndex
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              isCompleted
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <span className={`text-xs mt-2 text-center ${
                            isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                          }`}>
                            {statusConfig[step].label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {/* Progress line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" style={{ marginLeft: '16px', marginRight: '16px' }}>
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Estimated delivery */}
                {order.orderStatus !== "delivered" && (
                  <div className="bg-green-50 rounded-sm p-4 flex items-center gap-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Estimated Delivery: <span className="font-bold">{estimatedDate}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Tracking history */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3">Tracking History</h3>
                  <div className="space-y-3">
                    {order.tracking.map((track, index) => {
                      const trackDate = new Date(track.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                      return (
                        <div key={index} className="flex gap-3">
                          <div className="relative">
                            <div className={`w-3 h-3 rounded-full mt-1.5 ${
                              index === 0 ? "bg-green-600" : "bg-gray-300"
                            }`} />
                            {index < order.tracking.length - 1 && (
                              <div className="absolute top-4 left-1.5 w-px h-full bg-gray-200 -translate-x-1/2" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm font-medium">{track.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {trackDate}
                              {track.location && ` - ${track.location}`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled message */}
            {isCancelled && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                    <p className="text-sm text-red-700 mt-1">
                      This order has been cancelled. If you paid online, the refund will be processed within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order items */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/50">
                <h2 className="font-bold text-sm">
                  Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="p-5 flex gap-4">
                    <Link href={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 bg-muted rounded-sm overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-sm font-medium hover:text-primary line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity} x {formatPrice(item.price)}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    {order.orderStatus === "delivered" && (
                      <div className="flex flex-col gap-2">
                        <Link href={`/product/${item.id}#reviews`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Write Review
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Return
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Delivery address */}
            <div className="bg-card border border-border rounded-sm p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery Address
              </h3>
              <div className="text-sm">
                <p className="font-medium">{order.address.name}</p>
                <p className="text-muted-foreground mt-1">
                  {order.address.addressLine1}
                  {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {order.address.phone}
                </p>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-card border border-border rounded-sm p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment Details
              </h3>
              <div className="text-sm">
                <p className="font-medium">
                  {order.paymentMethod === "cod" && "Cash on Delivery"}
                  {order.paymentMethod === "upi" && "UPI Payment"}
                  {order.paymentMethod === "card" && "Credit / Debit Card"}
                </p>
                <p className={`text-xs mt-1 ${
                  order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                }`}>
                  {order.paymentStatus === "paid" ? "Payment completed" : "Payment pending"}
                </p>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/50">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Price Summary
                </h3>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">- {formatPrice(order.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={order.deliveryCharge === 0 ? "text-green-600" : ""}>
                    {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed border-border">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Need help */}
            <div className="bg-card border border-border rounded-sm p-5">
              <h3 className="font-bold text-sm mb-2">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                If you have any questions about your order, we're here to help.
              </p>
              <Button variant="outline" className="w-full" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
