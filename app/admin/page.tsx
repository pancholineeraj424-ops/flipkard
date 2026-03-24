"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Star,
  MessageSquare,
  Box,
  Settings,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrders, OrderStatus } from "@/lib/order-context"
import { useReviews } from "@/lib/review-context"
import { products, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AdminTab = "dashboard" | "products" | "orders" | "reviews"

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  confirmed: { bg: "bg-blue-100", text: "text-blue-700" },
  processing: { bg: "bg-yellow-100", text: "text-yellow-700" },
  shipped: { bg: "bg-purple-100", text: "text-purple-700" },
  out_for_delivery: { bg: "bg-orange-100", text: "text-orange-700" },
  delivered: { bg: "bg-green-100", text: "text-green-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" }
}

const statusLabels: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled"
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { orders } = useOrders()
  const { reviews } = useReviews()
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/admin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => 
    o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"
  ).length
  const totalProducts = products.length
  const totalReviews = reviews.length
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border min-h-screen sticky top-0">
          <div className="p-4 border-b border-border">
            <h1 className="font-bold text-lg text-primary flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Admin Panel
            </h1>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-border">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowUpRight className="h-4 w-4" />
              View Store
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Mobile tabs */}
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-sm whitespace-nowrap ${
                    activeTab === item.id
                      ? "bg-primary text-white"
                      : "bg-white text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
                <p className="text-muted-foreground text-sm">Welcome back, {user.name}!</p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Revenue</span>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% from last month
                  </p>
                </div>

                <div className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Orders</span>
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pendingOrders} pending
                  </p>
                </div>

                <div className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Products</span>
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active listings
                  </p>
                </div>

                <div className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Reviews</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold">{avgRating}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalReviews} reviews
                  </p>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-sm border border-border">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("orders")}
                    className="text-primary"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {orders.slice(0, 5).map((order) => {
                    const statusStyle = statusColors[order.orderStatus]
                    return (
                      <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center">
                            <Box className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.items.length} items - {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusLabels[order.orderStatus]}
                        </span>
                      </div>
                    )
                  })}
                  {orders.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-sm border border-border">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Top Products</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("products")}
                    className="text-primary"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-muted rounded-sm overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Products</h2>
                  <p className="text-muted-foreground text-sm">{products.length} products</p>
                </div>
                <Button className="bg-[#fb641b] hover:bg-[#e85a19]">
                  Add Product
                </Button>
              </div>

              {/* Search and filter */}
              <div className="bg-white rounded-sm border border-border p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products table */}
              <div className="bg-white rounded-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Product
                        </th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Category
                        </th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Price
                        </th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Rating
                        </th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Stock
                        </th>
                        <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-contain"
                                  sizes="40px"
                                />
                              </div>
                              <span className="text-sm font-medium line-clamp-1">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-sm">
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              {product.rating}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Orders</h2>
                  <p className="text-muted-foreground text-sm">{orders.length} total orders</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders list */}
              <div className="bg-white rounded-sm border border-border overflow-hidden">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No orders yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Order ID
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Customer
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Date
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Status
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Payment
                          </th>
                          <th className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-3">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((order) => {
                          const statusStyle = statusColors[order.orderStatus]
                          const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                          return (
                            <tr key={order.id} className="hover:bg-muted/30">
                              <td className="px-4 py-3">
                                <Link href={`/orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                                  {order.id}
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm">{order.address.name}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-muted-foreground">{orderDate}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.text}`}>
                                  {statusLabels[order.orderStatus]}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-medium ${
                                  order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                                }`}>
                                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Reviews</h2>
                <p className="text-muted-foreground text-sm">{reviews.length} total reviews</p>
              </div>

              {/* Reviews list */}
              <div className="bg-white rounded-sm border border-border divide-y divide-border">
                {reviews.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No reviews yet
                  </div>
                ) : (
                  reviews.map((review) => {
                    const product = products.find(p => p.id === review.productId)
                    return (
                      <div key={review.id} className="p-4">
                        <div className="flex items-start gap-4">
                          {product && (
                            <Link href={`/product/${product.id}`} className="flex-shrink-0">
                              <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-contain"
                                  sizes="64px"
                                />
                              </div>
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded text-white ${
                                review.rating >= 4 ? "bg-[#388e3c]" : review.rating === 3 ? "bg-yellow-500" : "bg-red-500"
                              }`}>
                                {review.rating} <Star className="h-2.5 w-2.5 fill-current" />
                              </span>
                              <span className="font-semibold text-sm">{review.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{review.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{review.userName}</span>
                              <span>{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
                              {product && (
                                <Link href={`/product/${product.id}`} className="text-primary hover:underline">
                                  {product.name}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
