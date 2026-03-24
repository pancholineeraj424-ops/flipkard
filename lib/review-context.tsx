"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  images?: string[]
  helpful: number
  createdAt: string
  verified: boolean
}

interface ReviewContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "createdAt" | "helpful">) => void
  getProductReviews: (productId: string) => Review[]
  getAverageRating: (productId: string) => { average: number; count: number }
  markHelpful: (reviewId: string) => void
  getUserReviews: (userId: string) => Review[]
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

// Some demo reviews
const initialReviews: Review[] = [
  {
    id: "rev_1",
    productId: "1",
    userId: "user_1",
    userName: "Rahul S.",
    rating: 5,
    title: "Amazing phone!",
    content: "Best iPhone ever. Camera quality is outstanding and battery life is great. Worth every penny!",
    helpful: 124,
    createdAt: "2024-02-15",
    verified: true
  },
  {
    id: "rev_2",
    productId: "1",
    userId: "user_2",
    userName: "Priya M.",
    rating: 4,
    title: "Great but expensive",
    content: "Excellent phone with amazing features. Only wish it was a bit more affordable. The titanium design feels premium.",
    helpful: 89,
    createdAt: "2024-02-10",
    verified: true
  },
  {
    id: "rev_3",
    productId: "2",
    userId: "user_3",
    userName: "Amit K.",
    rating: 5,
    title: "Samsung does it again!",
    content: "The S24 Ultra is a beast. The AI features are incredibly useful and the S Pen is a game changer for productivity.",
    helpful: 67,
    createdAt: "2024-02-08",
    verified: true
  },
  {
    id: "rev_4",
    productId: "3",
    userId: "user_4",
    userName: "Sneha R.",
    rating: 5,
    title: "Best headphones ever!",
    content: "The noise cancellation is simply the best I have ever experienced. Perfect for work from home and travel.",
    helpful: 156,
    createdAt: "2024-01-20",
    verified: true
  },
  {
    id: "rev_5",
    productId: "5",
    userId: "user_5",
    userName: "Vikram P.",
    rating: 4,
    title: "Good quality shirt",
    content: "Fabric is soft and comfortable. Fits perfectly as per size chart. Good value for money.",
    helpful: 45,
    createdAt: "2024-02-01",
    verified: true
  }
]

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load reviews from localStorage on mount
    const storedReviews = localStorage.getItem("flipkart_reviews")
    if (storedReviews) {
      try {
        const parsed = JSON.parse(storedReviews)
        // Merge with initial reviews
        const mergedReviews = [...initialReviews]
        parsed.forEach((review: Review) => {
          if (!mergedReviews.find(r => r.id === review.id)) {
            mergedReviews.push(review)
          }
        })
        setReviews(mergedReviews)
      } catch {
        localStorage.removeItem("flipkart_reviews")
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    // Persist reviews to localStorage
    if (isInitialized) {
      localStorage.setItem("flipkart_reviews", JSON.stringify(reviews))
    }
  }, [reviews, isInitialized])

  const addReview = (review: Omit<Review, "id" | "createdAt" | "helpful">) => {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      helpful: 0
    }
    setReviews(prev => [newReview, ...prev])
  }

  const getProductReviews = (productId: string): Review[] => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getAverageRating = (productId: string): { average: number; count: number } => {
    const productReviews = reviews.filter(review => review.productId === productId)
    if (productReviews.length === 0) {
      return { average: 0, count: 0 }
    }
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
    return {
      average: Math.round((sum / productReviews.length) * 10) / 10,
      count: productReviews.length
    }
  }

  const markHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    )
  }

  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId)
  }

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
        markHelpful,
        getUserReviews
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider")
  }
  return context
}
