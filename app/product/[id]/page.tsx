"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Star,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Heart,
  Share2,
  ThumbsUp,
  User,
  BadgeCheck,
} from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"
import { useReviews } from "@/lib/review-context"
import {
  getProductById,
  products,
  formatPrice,
  calculateDiscount,
} from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const { getProductReviews, addReview, markHelpful, getAverageRating } = useReviews()
  
  const product = getProductById(params.id as string)
  const [selectedImg, setSelectedImg] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [hoverRating, setHoverRating] = useState(0)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">Not found</div>
        <h1 className="text-xl font-bold mb-2">Product not found</h1>
        <Link href="/products" className="text-primary hover:underline text-sm">
          Back to products
        </Link>
      </div>
    )
  }

  const wishlisted = isInWishlist(product.id)
  const discount = calculateDiscount(product.originalPrice, product.price)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  const productReviews = getProductReviews(product.id)
  const ratingStats = getAverageRating(product.id)

  // Simulate multiple angles with same image
  const images = [product.image, product.image, product.image]

  const handleAddToCart = () => {
    addToCart(product)
    toast.success("Added to cart")
  }

  const handleBuyNow = () => {
    addToCart(product)
    router.push("/cart")
  }

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  const handleSubmitReview = () => {
    if (!user) {
      router.push(`/login?redirect=/product/${product.id}`)
      return
    }

    if (!reviewTitle.trim() || !reviewContent.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
      verified: true
    })

    setReviewTitle("")
    setReviewContent("")
    setReviewRating(5)
    setShowReviewForm(false)
    toast.success("Review submitted successfully")
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = productReviews.filter(r => r.rating === rating).length
    const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category}`} className="hover:text-primary capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1 max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr] gap-4">
        {/* Left: Image panel */}
        <div className="flex flex-col gap-3">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            {/* Main image */}
            <div className="relative aspect-square flex items-center justify-center bg-muted p-6">
              <Image
                src={images[selectedImg]}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="400px"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-sm">
                  {discount}% off
                </span>
              )}
              {/* Wishlist + Share */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={handleWishlist}
                  className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md"
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                  />
                </button>
                <button
                  className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex border-t border-border">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`flex-1 aspect-square p-2 border-r border-border last:border-r-0 hover:bg-muted transition-colors ${
                    selectedImg === i ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-contain" sizes="80px" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-sm bg-[#FF9F00] text-white hover:bg-[#E8900A] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </button>
          </div>
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-sm p-4 md:p-6">
            <h1 className="text-lg md:text-xl font-semibold text-foreground leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <span className="inline-flex items-center gap-1 bg-success text-success-foreground text-sm font-bold px-2 py-0.5 rounded-sm">
                {ratingStats.count > 0 ? ratingStats.average : product.rating} <Star className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-sm text-muted-foreground">
                {(ratingStats.count > 0 ? ratingStats.count + product.reviews : product.reviews).toLocaleString("en-IN")} Ratings & Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap mb-4">
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-base font-bold text-[#388e3c]">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Offers */}
            <div className="mb-4 pb-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">Available Offers</h3>
              <ul className="flex flex-col gap-1.5">
                {[
                  "10% off on HDFC Bank Cards",
                  "Extra 5% off with FlipKart Pay",
                  "No cost EMI on select cards",
                ].map((offer) => (
                  <li key={offer} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    {offer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border">
              <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Free Delivery{" "}
                  <span className="text-muted-foreground font-normal">
                    by Tomorrow, 10 AM
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Enter your pincode for exact delivery date
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-4 pb-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">Highlights</h3>
              <ul className="flex flex-col gap-1.5">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="mb-4 pb-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "1 Year Warranty" },
                { icon: RotateCcw, label: "30-Day Return" },
                { icon: Truck, label: "Free Shipping" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center p-2 bg-muted rounded-sm">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <section id="reviews" className="mt-6 bg-card border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Ratings & Reviews</h2>
          <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#fb641b] hover:bg-[#e85a19]">
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Please login to write a review</p>
                  <Link href={`/login?redirect=/product/${product.id}`}>
                    <Button className="bg-primary">Login</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {/* Star rating selector */}
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoverRating || reviewRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {reviewRating === 1 && "Poor"}
                        {reviewRating === 2 && "Fair"}
                        {reviewRating === 3 && "Good"}
                        {reviewRating === 4 && "Very Good"}
                        {reviewRating === 5 && "Excellent"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-title">Review Title</Label>
                    <Input
                      id="review-title"
                      placeholder="Sum up your review in a few words"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-content">Your Review</Label>
                    <Textarea
                      id="review-content"
                      placeholder="Share your experience with this product"
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSubmitReview} className="w-full bg-[#fb641b] hover:bg-[#e85a19]">
                    Submit Review
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
            {/* Rating summary */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-4xl font-bold">
                  {ratingStats.count > 0 ? ratingStats.average : product.rating}
                </span>
                <Star className="h-8 w-8 fill-[#388e3c] text-[#388e3c]" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {(ratingStats.count > 0 ? ratingStats.count + product.reviews : product.reviews).toLocaleString()} ratings
              </p>

              {/* Rating bars */}
              <div className="space-y-1.5">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-gray-400 text-gray-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rating >= 4 ? "bg-[#388e3c]" : rating === 3 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    {/* Rating badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-sm text-white ${
                        review.rating >= 4 ? "bg-[#388e3c]" : review.rating === 3 ? "bg-yellow-500" : "bg-red-500"
                      }`}>
                        {review.rating} <Star className="h-2.5 w-2.5 fill-current" />
                      </span>
                      <span className="font-semibold text-sm">{review.title}</span>
                    </div>

                    {/* Review content */}
                    <p className="text-sm text-muted-foreground mb-3">{review.content}</p>

                    {/* Review meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{review.userName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-0.5 text-[#388e3c]">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span>{new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}</span>
                    </div>

                    {/* Helpful button */}
                    <button
                      onClick={() => markHelpful(review.id)}
                      className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-4 bg-card border border-border rounded-sm">
          <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Similar Products</h2>
            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
            {relatedProducts.map((p) => (
              <div key={p.id} className="bg-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
