"use client"

import { useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense } from "react"
import { SlidersHorizontal, ChevronDown, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products, categories, searchProducts, getProductsByCategory } from "@/lib/products"

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "discount", label: "Discount" },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") || ""
  const searchQuery = searchParams.get("search") || ""
  const [sort, setSort] = useState("relevance")
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [minRating, setMinRating] = useState(0)

  const baseProducts = useMemo(() => {
    if (searchQuery) return searchProducts(searchQuery)
    if (categoryParam) return getProductsByCategory(categoryParam)
    return products
  }, [searchQuery, categoryParam])

  const filteredAndSorted = useMemo(() => {
    let result = baseProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1] && p.rating >= minRating
    )
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price)
    else if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price)
    else if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating)
    else if (sort === "discount")
      result = [...result].sort(
        (a, b) =>
          (b.originalPrice - b.price) / b.originalPrice -
          (a.originalPrice - a.price) / a.originalPrice
      )
    return result
  }, [baseProducts, sort, priceRange, minRating])

  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : categoryParam
    ? categories.find((c) => c.id === categoryParam)?.name ?? "Products"
    : "All Products"

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <a href="/" className="hover:text-primary">Home</a>
        <span>/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="flex gap-4">
        {/* Filter Sidebar — desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-card border border-border rounded-sm overflow-hidden sticky top-20">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </h3>
            </div>

            {/* Category */}
            <div className="px-4 py-3 border-b border-border">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Category</h4>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className={`text-sm py-0.5 hover:text-primary transition-colors ${
                      categoryParam === cat.id ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="px-4 py-3 border-b border-border">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Min Rating</h4>
              <div className="flex flex-col gap-2">
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">{r}★ & above</span>
                  </label>
                ))}
                {minRating > 0 && (
                  <button
                    onClick={() => setMinRating(0)}
                    className="text-xs text-primary mt-1 text-left hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Discount */}
            <div className="px-4 py-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Discount</h4>
              <div className="flex flex-col gap-2">
                {["10% or more", "20% or more", "30% or more", "50% or more"].map((label) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    <span className="text-sm text-muted-foreground">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="bg-card border border-border rounded-sm flex items-center justify-between px-4 py-3 mb-3">
            <div>
              <h1 className="text-base font-bold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{filteredAndSorted.length} results found</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center gap-1.5 text-sm font-medium text-primary border border-primary rounded-sm px-3 py-1.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>

              {/* Sort */}
              <div className="relative flex items-center gap-1.5">
                <label htmlFor="sort" className="text-xs text-muted-foreground hidden md:block">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-border rounded-sm px-2 py-1.5 bg-card text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile filter panel */}
          {filterOpen && (
            <div className="md:hidden bg-card border border-border rounded-sm px-4 py-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Filters</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold mb-2">Category</h4>
                  <div className="flex flex-col gap-1.5">
                    {categories.slice(0, 5).map((cat) => (
                      <a
                        key={cat.id}
                        href={`/products?category=${cat.id}`}
                        className={`text-sm ${categoryParam === cat.id ? "text-primary font-semibold" : "text-muted-foreground"}`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold mb-2">Min Rating</h4>
                  <div className="flex flex-col gap-1.5">
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ratingMobile"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-muted-foreground">{r}★+</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border rounded-sm overflow-hidden">
              {filteredAndSorted.map((product) => (
                <div key={product.id} className="bg-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-sm py-20 flex flex-col items-center gap-3 text-center">
              <div className="text-5xl">🔍</div>
              <h3 className="text-lg font-semibold text-foreground">No products found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <a
                href="/products"
                className="mt-2 text-sm text-primary font-medium hover:underline"
              >
                Browse all products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
