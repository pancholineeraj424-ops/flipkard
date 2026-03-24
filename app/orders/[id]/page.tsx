"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  MapPin,
  Phone,
  CreditCard,
  AlertCircle,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useOrders, Order, OrderStatus, OrderTracking } from "@/lib/orders-context"
import { formatPrice } from "@/lib/products"
import { toast } from "sonner"

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: typeof Package }> = {
  pending: { label: "Order Placed", color: "text-yellow-600", bgColor: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-600", bgColor: "bg-blue-500", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-blue-600", bgColor: "bg-blue-500", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-600", bgColor: "bg-purple-500", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-600", bgColor: "bg-orange-500", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-600", bgColor: "bg-green-500", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-500", icon: XCircle },
  returned: { label: "Returned", color: "text-gray-600", bgColor: "bg-gray-500", icon: XCircle }
}

const statusOrder: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { getOrderById, cancelOrder } = useOrders()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const order = getOrderById(params.id as string)

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

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Order not found</h1>
        <p className="text-muted-foreground mb-4">This order does not exist or you do not have access to it.</p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleCancelOrder = () => {
    const success = cancelOrder(order.id)
    if (success) {
      toast.success("Order cancelled successfully")
      setShowCancelDialog(false)
    } else {
      toast.error("Cannot cancel this order")
    }
  }

  const canCancel = !["shipped", "out_for_delivery", "delivered", "cancelled", "returned"].includes(order.status)
  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="bg-card border border-border rounded-sm mb-4">
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-foreground">Order {order.id}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {canCancel && (
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Order
                </Button>
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium ${statusConfig[order.status].color} bg-opacity-10`}
                style={{ backgroundColor: `${statusConfig[order.status].bgColor}20` }}
              >
                {(() => {
                  const Icon = statusConfig[order.status].icon
                  return <Icon className="h-4 w-4" />
                })()}
                {statusConfig[order.status].label}
              </div>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        {!["cancelled", "returned"].includes(order.status) && (
          <div className="p-4 border-b border-border">
            <div className="relative">
              <div className="flex justify-between">
                {statusOrder.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  const config = statusConfig[status]
                  const Icon = config.icon

                  return (
                    <div key={status} className="flex flex-col items-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? config.bgColor : "bg-gray-200"
                      } ${isCurrent ? "ring-4 ring-offset-2" : ""}`}
                        style={isCurrent ? { ringColor: `${config.bgColor}40` } : {}}
                      >
                        <Icon className={`h-4 w-4 ${isCompleted ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <span className={`text-xs mt-2 text-center hidden sm:block ${
                        isCompleted ? config.color : "text-muted-foreground"
                      }`}>
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0" style={{ width: "calc(100% - 32px)", left: "16px" }}>
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tracking timeline */}
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-4">Tracking History</h3>
          <div className="space-y-0">
            {[...order.tracking].reverse().map((track, index) => (
              <TrackingItem key={index} tracking={track} formatDateTime={formatDateTime} isLast={index === order.tracking.length - 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Order items */}
        <div className="md:col-span-2 bg-card border border-border rounded-sm">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Items in this order</h3>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                <Link href={`/product/${item.id}`} className="relative w-20 h-20 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">
                    {item.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                  <div className="text-sm font-semibold mt-1">{formatPrice(item.price)}</div>
                  {order.status === "delivered" && (
                    <Link href={`/product/${item.id}#reviews`}>
                      <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1">
                        <Star className="h-3 w-3" />
                        Rate & Review
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order details sidebar */}
        <div className="space-y-4">
          {/* Delivery address */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h3>
            <div className="text-sm">
              <p className="font-medium">{order.address.name}</p>
              <p className="text-muted-foreground mt-1">
                {order.address.address}, {order.address.locality}
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
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}>
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="font-semibold mb-3">Price Details</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={order.deliveryCharge === 0 ? "text-green-600" : ""}>
                  {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TrackingItem({ tracking, formatDateTime, isLast }: { tracking: OrderTracking; formatDateTime: (date: string) => string; isLast: boolean }) {
  const config = statusConfig[tracking.status]
  const Icon = config.icon

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.bgColor}`}>
          <Icon className="h-3 w-3 text-white" />
        </div>
        {!isLast && <div className="w-0.5 h-8 bg-border" />}
      </div>
      <div className="pb-4">
        <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
        <p className="text-xs text-muted-foreground">{tracking.description}</p>
        {tracking.location && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" />
            {tracking.location}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{formatDateTime(tracking.timestamp)}</p>
      </div>
    </div>
  )
}
