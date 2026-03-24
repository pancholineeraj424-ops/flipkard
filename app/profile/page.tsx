"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/products"

type ProfileTab = "profile" | "orders" | "addresses" | "payments" | "wishlist"

interface Order {
  id: string
  date: string
  status: "delivered" | "shipped" | "processing" | "cancelled"
  total: number
  items: {
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  type: "home" | "work"
  isDefault?: boolean
}

const mockOrders: Order[] = [
  {
    id: "FC20260315001",
    date: "March 15, 2026",
    status: "delivered",
    total: 134999,
    items: [
      {
        name: "iPhone 15 Pro Max",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
        quantity: 1,
        price: 134999,
      },
    ],
  },
  {
    id: "FC20260310002",
    date: "March 10, 2026",
    status: "shipped",
    total: 26289,
    items: [
      {
        name: "Sony WH-1000XM5 Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        quantity: 1,
        price: 24990,
      },
      {
        name: "Men's Slim Fit Casual Shirt",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&h=100&fit=crop",
        quantity: 1,
        price: 799,
      },
    ],
  },
  {
    id: "FC20260301003",
    date: "March 1, 2026",
    status: "processing",
    total: 3998,
    items: [
      {
        name: "Running Shoes Pro",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
        quantity: 1,
        price: 2999,
      },
      {
        name: "Programming Books Bundle",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop",
        quantity: 1,
        price: 899,
      },
    ],
  },
]

const mockAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "9876543210",
    address: "123, ABC Apartments, 4th Floor, MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    type: "home",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "9876543210",
    address: "Office No. 405, Tech Park, Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    type: "work",
  },
]

const statusConfig = {
  delivered: { label: "Delivered", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "text-primary", bg: "bg-primary/10", icon: Truck },
  processing: { label: "Processing", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  cancelled: { label: "Cancelled", color: "text-destructive", bg: "bg-destructive/10", icon: CheckCircle2 },
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  // User profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "9876543210",
    gender: "male",
  })

  const menuItems = [
    { id: "profile" as ProfileTab, label: "My Profile", icon: User },
    { id: "orders" as ProfileTab, label: "My Orders", icon: Package },
    { id: "addresses" as ProfileTab, label: "Manage Addresses", icon: MapPin },
    { id: "payments" as ProfileTab, label: "Payment Methods", icon: CreditCard },
    { id: "wishlist" as ProfileTab, label: "My Wishlist", icon: Heart },
  ]

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">My Account</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Sidebar */}
        <aside className="space-y-3">
          {/* User card */}
          <div className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hello,</p>
                <p className="font-bold text-foreground">{profile.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-border last:border-b-0 ${
                  activeTab === item.id
                    ? "bg-primary/5 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="bg-card border border-border rounded-sm">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-100 disabled:cursor-default"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-100 disabled:cursor-default"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-100 disabled:cursor-default"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((gender) => (
                      <label
                        key={gender}
                        className={`flex items-center gap-2 cursor-pointer ${!isEditing && "pointer-events-none"}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={profile.gender === gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                          disabled={!isEditing}
                          className="accent-primary"
                        />
                        <span className="text-sm capitalize text-foreground">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                )}
              </div>

              {/* Account Settings */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-base font-bold text-foreground mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                  <button className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
                    <CreditCard className="h-5 w-5" />
                    Saved Cards & Wallets
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">
                My Orders
              </h2>

              {mockOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-1">No orders yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here</p>
                  <Link
                    href="/products"
                    className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockOrders.map((order) => {
                    const status = statusConfig[order.status]
                    const StatusIcon = status.icon
                    return (
                      <div key={order.id} className="border border-border rounded-sm overflow-hidden">
                        {/* Order header */}
                        <div className="bg-muted/50 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <span className="text-xs text-muted-foreground">Order ID: </span>
                              <span className="text-xs font-mono font-semibold text-foreground">{order.id}</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Placed on: </span>
                              <span className="text-xs text-foreground">{order.date}</span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium ${status.bg} ${status.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </div>
                        </div>

                        {/* Order items */}
                        <div className="p-4 space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order footer */}
                        <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-t border-border">
                          <div>
                            <span className="text-sm text-muted-foreground">Total: </span>
                            <span className="text-sm font-bold text-foreground">{formatPrice(order.total)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              Track Order
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Manage Addresses</h2>
                <Button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="gap-2 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>

              {/* Add address form */}
              {showAddressForm && (
                <div className="mb-6 p-4 border border-border rounded-sm bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addr-name">Full Name</Label>
                      <Input id="addr-name" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-phone">Mobile Number</Label>
                      <Input id="addr-phone" placeholder="10-digit number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-pincode">Pincode</Label>
                      <Input id="addr-pincode" placeholder="6-digit pincode" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-city">City</Label>
                      <Input id="addr-city" placeholder="City" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="addr-address">Address</Label>
                      <Input id="addr-address" placeholder="House No., Building, Street, Area" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addr-state">State</Label>
                      <Input id="addr-state" placeholder="State" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <div className="flex gap-4 items-center h-9">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="addr-type" value="home" defaultChecked className="accent-primary" />
                          <span className="text-sm text-foreground">Home</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="addr-type" value="work" className="accent-primary" />
                          <span className="text-sm text-foreground">Work</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => setShowAddressForm(false)} className="bg-primary hover:bg-primary/90">
                      Save Address
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Saved addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-sm p-4 relative ${
                      addr.isDefault ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    {addr.isDefault && (
                      <span className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-sm font-medium">
                        Default
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-foreground">{addr.name}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">Phone: {addr.phone}</p>
                    <div className="flex gap-3 pt-2 border-t border-border">
                      <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button className="text-xs text-destructive font-medium hover:underline flex items-center gap-1">
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                      {!addr.isDefault && (
                        <button className="text-xs text-foreground font-medium hover:underline ml-auto">
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">
                Saved Payment Methods
              </h2>
              
              <div className="py-12 text-center">
                <CreditCard className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No saved cards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save your cards for faster checkout
                </p>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Card
                </Button>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-border">
                My Wishlist
              </h2>
              
              <div className="py-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-1">Your wishlist is empty</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save items you love by clicking the heart icon
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
