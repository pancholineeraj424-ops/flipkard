"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useCart, Product } from "@/lib/cart-context"
import { formatPrice, calculateDiscount } from "@/lib/products"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const discount = calculateDiscount(product.originalPrice, product.price)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((w) => !w)
  }

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="group bg-white hover:shadow-lg transition-all duration-200 h-full flex flex-col overflow-hidden p-4">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden flex items-center justify-center mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-0 right-0 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>

        {/* Product info */}
        <div className="flex flex-col flex-1 text-center">
          <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-[#2874f0] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-xs font-semibold px-1.5 py-0.5 rounded-sm">
              {product.rating} <Star className="h-2.5 w-2.5 fill-current" />
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviews.toLocaleString("en-IN")})
            </span>
          </div>

          {/* Price block */}
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-semibold text-[#388e3c]">
                {discount}% off
              </span>
            )}
          </div>

          {/* Free delivery label */}
          <p className="text-[11px] text-gray-500 mt-1">Free Delivery</p>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium bg-[#ff9f00] text-white rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-[#fb641b]"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
