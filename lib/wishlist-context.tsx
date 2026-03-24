"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Product } from "./cart-context"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load wishlist from localStorage on mount
    const storedWishlist = localStorage.getItem("flipkart_wishlist")
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist))
      } catch {
        localStorage.removeItem("flipkart_wishlist")
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    // Persist wishlist to localStorage
    if (isInitialized) {
      localStorage.setItem("flipkart_wishlist", JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addToWishlist = (product: Product) => {
    setItems(prevItems => {
      if (prevItems.find(item => item.id === product.id)) {
        return prevItems
      }
      return [...prevItems, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        totalItems: items.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
