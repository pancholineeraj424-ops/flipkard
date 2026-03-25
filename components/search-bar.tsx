"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, X, TrendingUp } from "lucide-react"
import Image from "next/image"
import { products, formatPrice } from "@/lib/products"
import type { Product } from "@/lib/cart-context"

const RECENT_SEARCHES_KEY = "flipkard_recent_searches"
const MAX_RECENT_SEARCHES = 5
const MAX_SUGGESTIONS = 8

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 text-gray-900 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  )
}

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter((s) => s.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Search products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      return
    }

    const lowercaseQuery = debouncedQuery.toLowerCase()
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    ).slice(0, MAX_SUGGESTIONS)

    setSuggestions(results)
    setSelectedIndex(-1)
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      setRecentSearches(getRecentSearches())
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setQuery("")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      router.push(`/product/${suggestions[selectedIndex].id}`)
      setIsOpen(false)
      setQuery("")
    } else {
      handleSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + (query ? 0 : recentSearches.length)
    
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const showDropdown = isOpen && (suggestions.length > 0 || (!query && recentSearches.length > 0))

  return (
    <div ref={containerRef} className="relative flex-1 max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for Products, Brands and More"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-sm bg-[#f0f5ff] placeholder:text-gray-500 focus:outline-none focus:border-[#2874f0] focus:bg-white transition-colors"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-[#2874f0] hover:underline font-medium"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    selectedIndex === index ? "bg-gray-50" : ""
                  }`}
                >
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.length > 0 && (
            <div>
              {query && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" />
                    Products
                  </span>
                </div>
              )}
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => {
                    router.push(`/product/${product.id}`)
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    selectedIndex === index ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="relative h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">
                      {highlightMatch(product.name, debouncedQuery)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 capitalize flex-shrink-0">
                    in {product.category}
                  </span>
                </button>
              ))}
              
              {/* View all results */}
              {query && (
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#2874f0] font-medium text-sm border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  View all results for "{query}"
                </button>
              )}
            </div>
          )}

          {/* No results */}
          {query && debouncedQuery && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <div className="text-gray-400 text-sm">No products found for "{query}"</div>
              <button
                onClick={() => handleSearch(query)}
                className="mt-2 text-[#2874f0] text-sm font-medium hover:underline"
              >
                Search anyway
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
