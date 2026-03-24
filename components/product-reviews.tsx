"use client"

import { useState } from "react"
import { Star, ThumbsUp, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useReviews, Review } from "@/lib/reviews-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { 
    getProductReviews, 
    getAverageRating, 
    getTotalReviews,
    getRatingDistribution,
    addReview,
    markHelpful
  } = useReviews()
  const { user, isAuthenticated } = useAuth()
  
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: ""
  })
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("helpful")

  const reviews = getProductReviews(productId)
  const averageRating = getAverageRating(productId)
  const totalReviews = getTotalReviews(productId)
  const distribution = getRatingDistribution(productId)

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") {
      return b.helpful - a.helpful
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)

  const handleSubmitReview = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to write a review")
      return
    }
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    addReview({
      productId,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      verified: true
    })

    setNewReview({ rating: 5, title: "", content: "" })
    setShowWriteReview(false)
    toast.success("Review submitted successfully!")
  }

  const handleMarkHelpful = (reviewId: string) => {
    markHelpful(reviewId)
    toast.success("Thanks for your feedback!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="bg-card border border-border rounded-sm mt-4">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-base font-bold text-foreground">Ratings & Reviews</h2>
      </div>

      <div className="p-4 md:p-6">
        {/* Rating summary */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-6 pb-6 border-b border-border">
          {/* Overall rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-bold text-foreground">
                  {averageRating || "-"}
                </span>
                <Star className="h-6 w-6 fill-[#388e3c] text-[#388e3c]" />
              </div>
              <div className="text-sm text-muted-foreground">
                {totalReviews.toLocaleString()} ratings
              </div>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="flex-1 max-w-xs space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-4">{star}</span>
                  <Star className="h-3 w-3 text-muted-foreground" />
                  <Progress value={percentage} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-8">{count}</span>
                </div>
              )
            })}
          </div>

          {/* Write review button */}
          <div className="md:ml-auto">
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  Rate Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating
                                ? "fill-[#ff9f00] text-[#ff9f00]"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Review Title
                    </label>
                    <Input
                      placeholder="Summarize your review"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Review
                    </label>
                    <Textarea
                      placeholder="Share your experience with this product"
                      rows={4}
                      value={newReview.content}
                      onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full bg-[#fb641b] hover:bg-[#fb641b]/90"
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Sort options */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <button
              onClick={() => setSortBy("helpful")}
              className={`text-sm ${sortBy === "helpful" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Most Helpful
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`text-sm ${sortBy === "recent" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Most Recent
            </button>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onMarkHelpful={handleMarkHelpful}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Show more button */}
        {reviews.length > 3 && !showAllReviews && (
          <button
            onClick={() => setShowAllReviews(true)}
            className="mt-4 flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          >
            View All {reviews.length} Reviews
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ 
  review, 
  onMarkHelpful,
  formatDate
}: { 
  review: Review
  onMarkHelpful: (id: string) => void
  formatDate: (date: string) => string
}) {
  return (
    <div className="pb-4 border-b border-border last:border-b-0">
      {/* Rating badge */}
      <div className="flex items-start gap-3 mb-2">
        <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
          {review.rating} <Star className="h-2.5 w-2.5 fill-current" />
        </span>
        <h4 className="font-medium text-sm text-foreground">{review.title}</h4>
      </div>

      {/* Review content */}
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
        {review.content}
      </p>

      {/* Review meta */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{review.userName}</span>
        {review.verified && (
          <span className="flex items-center gap-1 text-[#388e3c]">
            <CheckCircle2 className="h-3 w-3" />
            Certified Buyer
          </span>
        )}
        <span>{formatDate(review.createdAt)}</span>
      </div>

      {/* Helpful button */}
      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={() => onMarkHelpful(review.id)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful ({review.helpful})
        </button>
      </div>
    </div>
  )
}
