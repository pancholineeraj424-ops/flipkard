"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  ChevronRight,
  ShoppingCart,
  Trash2,
  Star,
  ShoppingBag,
} from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { formatPrice, calculateDiscount } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (productId: string) => {
    const product = items.find(item => item.id === productId)
    if (product) {
      addToCart(product)
      removeFromWishlist(productId)
      toast.success("Moved to cart")
    }
  }

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId)
    toast.success("Removed from wishlist")
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">My Wishlist</span>
        </nav>

        {items.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-12 text-center">
            <Heart className="h-20 w-20 mx-auto text-muted-foreground/20 mb-4" />
            <h1 className="text-xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product. 
              They'll appear here for easy access later.
            </p>
            <Link href="/products">
              <Button className="bg-[#fb641b] hover:bg-[#e85a19]">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-card border border-border rounded-sm p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold">My Wishlist ({items.length})</h1>
                <p className="text-sm text-muted-foreground">
                  Items you've saved for later
                </p>
              </div>
              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearWishlist()
                    toast.success("Wishlist cleared")
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Wishlist grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border border border-border rounded-sm overflow-hidden">
              {items.map((item) => {
                const discount = calculateDiscount(item.originalPrice, item.price)
                return (
                  <div key={item.id} className="bg-card p-4 flex flex-col">
                    {/* Image */}
                    <Link href={`/product/${item.id}`} className="block mb-3">
                      <div className="relative aspect-square bg-muted rounded-sm overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2 hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-[#ff6161] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 flex flex-col">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          {item.rating} <Star className="h-2 w-2 fill-current" />
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({item.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-sm font-bold">{formatPrice(item.price)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-3 flex flex-col gap-2">
                        <Button
                          onClick={() => handleMoveToCart(item.id)}
                          className="w-full h-9 bg-[#ff9f00] hover:bg-[#fb641b] text-white text-xs font-semibold"
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                          Move to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemove(item.id)}
                          className="w-full h-8 text-xs text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Continue shopping */}
            <div className="mt-4 text-center">
              <Link href="/products">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
