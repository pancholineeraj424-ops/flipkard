"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  MapPin,
  Smartphone,
  Shirt,
  Tv,
  Sparkles,
  Home,
  Refrigerator,
  Baby,
  Apple,
  Car,
  Bike,
  Dumbbell,
  BookOpen,
  Sofa,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { SearchBar } from "@/components/search-bar"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"

const categoryIcons = [
  { id: "for-you", name: "For You", icon: Sparkles },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "mobiles", name: "Mobiles", icon: Smartphone },
  { id: "beauty", name: "Beauty", icon: Sparkles },
  { id: "electronics", name: "Electronics", icon: Tv },
  { id: "home", name: "Home", icon: Home },
  { id: "appliances", name: "Appliances", icon: Refrigerator },
  { id: "toys", name: "Toys, ba...", icon: Baby },
  { id: "food", name: "Food & H...", icon: Apple },
  { id: "auto", name: "Auto Acc...", icon: Car },
  { id: "2wheelers", name: "2 Wheele...", icon: Bike },
  { id: "sports", name: "Sports & ...", icon: Dumbbell },
  { id: "books", name: "Books & ...", icon: BookOpen },
  { id: "furniture", name: "Furniture", icon: Sofa },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm">
        {/* Top yellow header */}
        <div className="bg-[#ffe500]">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-4 h-14">

              {/* Logo button - blue */}
              <Link 
                href="/" 
                className="flex-shrink-0 bg-[#2874f0] text-white px-4 py-1.5 rounded-sm flex items-center gap-2 font-bold text-lg"
              >
                <span className="text-xl">f</span>
                <span>FlipKard</span>
              </Link>

              {/* Travel button */}
              <Link
                href="/products"
                className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="text-red-500">*</span>
                Travel
              </Link>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Location */}
              <div className="hidden lg:flex items-center gap-1 text-sm text-gray-700">
                <MapPin className="h-4 w-4" />
                <span className="text-muted-foreground">Location not set</span>
                <span className="text-[#2874f0] font-medium cursor-pointer hover:underline">
                  Select delivery location &gt;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search row - white */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center gap-4 h-12">
              {/* Search bar */}
              <SearchBar />

              {/* Right actions */}
              <div className="hidden md:flex items-center gap-1">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 font-medium gap-1 h-9">
                        <div className="w-6 h-6 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold">
                          {user.phoneNumber.slice(-2)}
                        </div>
                        <span className="max-w-[80px] truncate">{user.phoneNumber.slice(-4)}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-3 py-2 border-b">
                        <div className="text-sm font-medium">+91 {user.phoneNumber}</div>
                        <div className="text-xs text-muted-foreground">Logged in</div>
                      </div>
                      <DropdownMenuItem>My Profile</DropdownMenuItem>
                      <DropdownMenuItem>Orders</DropdownMenuItem>
                      <DropdownMenuItem>Wishlist</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:bg-gray-100 font-medium gap-1 h-9"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    <User className="h-4 w-4" />
                    Login
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 font-medium gap-1 h-9">
                      More
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
                    <DropdownMenuItem>24x7 Customer Care</DropdownMenuItem>
                    <DropdownMenuItem>Advertise</DropdownMenuItem>
                    <DropdownMenuItem>Download App</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/cart">
                  <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 font-medium gap-1.5 h-9 relative">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 left-4 bg-[#ff6161] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Mobile buttons */}
              <div className="flex md:hidden items-center gap-1">
                <Link href="/cart" className="relative p-2">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-[#ff6161] text-white text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] p-0">
                    <div className="bg-[#2874f0] text-white px-5 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        {isAuthenticated && user ? (
                          <div>
                            <div className="font-semibold">+91 {user.phoneNumber}</div>
                            <button 
                              onClick={handleLogout}
                              className="text-xs text-white/70 hover:text-white"
                            >
                              Logout
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold">Hello, Guest</div>
                            <button 
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setLoginModalOpen(true)
                              }}
                              className="text-xs text-white/70 hover:text-white"
                            >
                              Login / Sign Up
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Categories
                      </div>
                      {categoryIcons.slice(0, 10).map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                          <category.icon className="h-5 w-5 text-[#ff9f00]" />
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Category navigation bar - white with icons */}
        <div className="bg-white border-b border-gray-200 hidden md:block">
          <div className="max-w-[1400px] mx-auto px-4">
            <nav className="flex items-center justify-center gap-0 overflow-x-auto">
              {categoryIcons.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-gray-50 transition-colors min-w-[80px]"
                >
                  <category.icon className="h-6 w-6 text-[#ff9f00]" />
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}
