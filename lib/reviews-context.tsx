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
  verified: boolean
  createdAt: string
}

interface ReviewsContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "createdAt" | "helpful">) => void
  getProductReviews: (productId: string) => Review[]
  getAverageRating: (productId: string) => number
  getTotalReviews: (productId: string) => number
  getRatingDistribution: (productId: string) => Record<number, number>
  markHelpful: (reviewId: string) => void
  getUserReviews: (userId: string) => Review[]
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

// Demo reviews
const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "1",
    userId: "user-1",
    userName: "Rahul S.",
    rating: 5,
    title: "Best iPhone Ever!",
    content: "The iPhone 15 Pro Max is absolutely incredible. The camera quality is outstanding, especially in low light. The titanium design feels premium and the phone is surprisingly light. Battery life easily lasts a full day with heavy usage.",
    helpful: 234,
    verified: true,
    createdAt: "2026-03-15T10:00:00Z"
  },
  {
    id: "rev-2",
    productId: "1",
    userId: "user-2",
    userName: "Priya M.",
    rating: 4,
    title: "Great phone but expensive",
    content: "Excellent performance and camera. The 5x zoom is amazing for photography. Only downside is the price, but if you can afford it, its worth every rupee.",
    helpful: 156,
    verified: true,
    createdAt: "2026-03-10T10:00:00Z"
  },
  {
    id: "rev-3",
    productId: "1",
    userId: "user-3",
    userName: "Amit K.",
    rating: 5,
    title: "Superb upgrade from iPhone 13",
    content: "Upgraded from iPhone 13 Pro and the difference is noticeable. Action button is very handy, USB-C is finally here, and the display is gorgeous.",
    helpful: 89,
    verified: true,
    createdAt: "2026-03-05T10:00:00Z"
  },
  {
    id: "rev-4",
    productId: "2",
    userId: "user-1",
    userName: "Rahul S.",
    rating: 5,
    title: "Galaxy AI is game changer",
    content: "The Galaxy AI features are incredible. Circle to Search, Live Translate, and the AI photo editing tools are so useful. Display is absolutely stunning.",
    helpful: 178,
    verified: true,
    createdAt: "2026-03-12T10:00:00Z"
  },
  {
    id: "rev-5",
    productId: "3",
    userId: "user-4",
    userName: "Neha R.",
    rating: 5,
    title: "Best headphones I have ever owned",
    content: "The noise cancellation is phenomenal. I use them daily for work calls and music. Battery life is excellent and they are super comfortable for long listening sessions.",
    helpful: 312,
    verified: true,
    createdAt: "2026-03-08T10:00:00Z"
  },
  {
    id: "rev-6",
    productId: "3",
    userId: "user-5",
    userName: "Vikram P.",
    rating: 4,
    title: "Premium sound quality",
    content: "Sound quality is top notch. ANC is the best in class. Slightly expensive but worth it if you value audio quality.",
    helpful: 145,
    verified: true,
    createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "rev-7",
    productId: "4",
    userId: "user-6",
    userName: "Sanjay T.",
    rating: 5,
    title: "M3 chip is blazing fast",
    content: "This MacBook Air is incredibly fast. The M3 chip handles everything I throw at it - coding, video editing, multiple browser tabs. Fan-less design means completely silent operation.",
    helpful: 267,
    verified: true,
    createdAt: "2026-03-14T10:00:00Z"
  },
  {
    id: "rev-8",
    productId: "5",
    userId: "user-7",
    userName: "Anjali D.",
    rating: 4,
    title: "Good quality for the price",
    content: "Nice fabric quality and fit is perfect. The color is exactly as shown in pictures. Good value for money during sales.",
    helpful: 56,
    verified: true,
    createdAt: "2026-03-10T10:00:00Z"
  }
]

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("flipkard_reviews")
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
      setReviews(initialReviews)
      localStorage.setItem("flipkard_reviews", JSON.stringify(initialReviews))
    }
  }, [])

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("flipkard_reviews", JSON.stringify(reviews))
    }
  }, [reviews])

  const addReview = (review: Omit<Review, "id" | "createdAt" | "helpful">) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      helpful: 0,
      createdAt: new Date().toISOString()
    }
    setReviews(prev => [newReview, ...prev])
  }

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter(r => r.productId === productId)
  }

  const getAverageRating = (productId: string): number => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
    return Number((sum / productReviews.length).toFixed(1))
  }

  const getTotalReviews = (productId: string): number => {
    return getProductReviews(productId).length
  }

  const getRatingDistribution = (productId: string): Record<number, number> => {
    const productReviews = getProductReviews(productId)
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    productReviews.forEach(r => {
      distribution[r.rating]++
    })
    return distribution
  }

  const markHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ))
  }

  const getUserReviews = (userId: string): Review[] => {
    return reviews.filter(r => r.userId === userId)
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
        getTotalReviews,
        getRatingDistribution,
        markHelpful,
        getUserReviews
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}
