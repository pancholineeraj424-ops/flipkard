"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Package, Truck, MapPin, CreditCard, ArrowRight } from "lucide-react"
import { useOrders } from "@/lib/order-context"
import { formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { getOrderById } = useOrders()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const order = getOrderById(params.id as string)

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="bg-white rounded-sm p-8 text-center max-w-md mx-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-xl font-bold mb-2">Order not found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const estimatedDate = new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Success message */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 text-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for shopping with FlipKart. Your order has been confirmed.
          </p>
          <div className="inline-block bg-muted rounded-sm px-4 py-2">
            <span className="text-sm text-muted-foreground">Order ID: </span>
            <span className="font-bold text-foreground">{order.id}</span>
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-foreground">Order Details</h2>
          </div>

          {/* Delivery info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Estimated Delivery</h3>
                <p className="text-lg font-bold text-green-600">{estimatedDate}</p>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Delivery Address</h3>
                <p className="text-sm font-medium">{order.address.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.addressLine1}
                  {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Phone: {order.address.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Payment Method</h3>
                <p className="text-sm font-medium">
                  {order.paymentMethod === "cod" && "Cash on Delivery"}
                  {order.paymentMethod === "upi" && "UPI Payment"}
                  {order.paymentMethod === "card" && "Credit / Debit Card"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.paymentStatus === "pending" ? "Payment pending" : "Payment completed"}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6">
            <h3 className="font-semibold text-sm mb-4">
              Items Ordered ({order.items.length} {order.items.length === 1 ? "item" : "items"})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`}>
                      <h4 className="text-sm font-medium line-clamp-1 hover:text-primary">
                        {item.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qty: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price summary */}
            <div className="mt-6 pt-4 border-t border-border space-y-2">
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
              <div className="flex justify-between text-base font-bold pt-2 border-t border-dashed border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/orders/${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full h-12">
              <Package className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full h-12 bg-[#fb641b] hover:bg-[#e85a19]">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
