"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateDiscount } from "@/lib/products"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const totalDiscount = totalOriginalPrice - totalPrice
  const deliveryCharge = totalPrice > 499 ? 0 : 49
  const finalAmount = totalPrice + deliveryCharge

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center gap-5 text-center">
        <div className="w-32 h-32 flex items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-primary opacity-20" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty!</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Add items to it now.
          </p>
        </div>
        <Link
          href="/products"
          className="bg-primary text-primary-foreground px-10 py-3 text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Cart</span>
        <span className="ml-1 text-muted-foreground">({totalItems} items)</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
        {/* Cart items */}
        <div className="flex flex-col gap-0 bg-card border border-border rounded-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3 border-b border-border bg-muted/50">
            <h1 className="text-base font-bold text-foreground">
              My Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
            </h1>
          </div>

          {/* Items list */}
          {items.map((item, index) => {
            const discount = calculateDiscount(item.originalPrice, item.price)
            return (
              <div
                key={item.id}
                className={`px-5 py-4 flex gap-4 ${
                  index < items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Product image */}
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-muted rounded-sm overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                    <span className="text-base font-bold text-foreground">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-semibold text-discount">
                        {discount}% off
                      </span>
                    )}
                  </div>

                  {/* Delivery info */}
                  <p className="text-xs text-success font-medium mt-1">
                    Free Delivery
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-border rounded-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-border text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Line total (desktop) */}
                <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Place Order button — bottom of items on mobile */}
          <div className="px-5 py-4 border-t border-border bg-muted/30 md:hidden">
            <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-sm text-sm hover:bg-primary/90 transition-colors">
              Place Order
            </button>
          </div>
        </div>

        {/* Price details sidebar */}
        <div className="flex flex-col gap-3">
          {/* Coupon */}
          <div className="bg-card border border-border rounded-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Apply Coupon</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 text-sm px-3 py-2 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              <button className="px-4 py-2 text-sm font-bold text-primary border border-primary rounded-sm hover:bg-primary/5 transition-colors">
                Apply
              </button>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Price Details
              </h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Price ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                <span>{formatPrice(totalOriginalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">Discount</span>
                <span className="text-discount font-medium">
                  − {formatPrice(totalDiscount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-success font-medium" : ""}>
                  {deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total Amount</span>
                <span className="text-base font-bold text-foreground">
                  {formatPrice(finalAmount)}
                </span>
              </div>
              {totalDiscount > 0 && (
                <div className="bg-success/10 rounded-sm px-3 py-2 text-sm font-medium text-success text-center">
                  You will save {formatPrice(totalDiscount)} on this order
                </div>
              )}
            </div>

            {/* Place Order CTA */}
            <div className="px-5 pb-5 hidden md:block">
              <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-sm text-sm hover:bg-primary/90 transition-colors">
                Place Order
              </button>
            </div>
          </div>

          {/* Safe & Secure */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
            <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Safe and Secure Payments. Easy returns.
          </div>
        </div>
      </div>
    </div>
  )
}
