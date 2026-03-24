"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  MapPin,
  Plus,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Shield,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth, Address } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import { formatPrice, calculateDiscount } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
]

type CheckoutStep = "address" | "payment" | "review"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, addAddress, isLoading: authLoading } = useAuth()
  const { createOrder } = useOrders()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [orderExpanded, setOrderExpanded] = useState(true)

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" as "home" | "work" | "other"
  })

  // Calculate totals
  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const totalDiscount = totalOriginalPrice - totalPrice
  const deliveryCharge = totalPrice > 499 ? 0 : 49
  const finalAmount = totalPrice + deliveryCharge

  useEffect(() => {
    // Set default address if user has one
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0]
      setSelectedAddress(defaultAddr)
    }
  }, [user])

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart")
    }
  }, [items, authLoading, router])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout")
    }
  }, [user, authLoading, router])

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error("Please fill all required fields")
      return
    }

    if (newAddress.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    if (newAddress.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode")
      return
    }

    addAddress({
      ...newAddress,
      isDefault: !user?.addresses?.length
    })

    setShowAddressForm(false)
    setNewAddress({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      type: "home"
    })
    toast.success("Address added successfully")
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const order = createOrder(
        items,
        selectedAddress,
        paymentMethod,
        totalOriginalPrice,
        totalDiscount,
        deliveryCharge
      )

      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cart" className="hover:text-primary">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
          {/* Main checkout steps */}
          <div className="flex flex-col gap-3">
            {/* Step 1: Address */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div 
                className={`px-5 py-3 flex items-center justify-between ${
                  currentStep === "address" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold ${
                    currentStep === "address" ? "bg-white text-primary" : 
                    selectedAddress ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                  }`}>
                    {selectedAddress && currentStep !== "address" ? <Check className="h-4 w-4" /> : "1"}
                  </span>
                  <span className="font-semibold text-sm">DELIVERY ADDRESS</span>
                </div>
                {selectedAddress && currentStep !== "address" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("address")}
                    className="text-primary h-7"
                  >
                    CHANGE
                  </Button>
                )}
              </div>

              {currentStep === "address" && (
                <div className="p-5">
                  {user?.addresses?.length ? (
                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                            selectedAddress?.id === address.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress?.id === address.id}
                            onChange={() => setSelectedAddress(address)}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{address.name}</span>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded uppercase">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-foreground mt-1">
                              Mobile: <span className="font-medium">{address.phone}</span>
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No saved addresses</p>
                    </div>
                  )}

                  {/* Add new address */}
                  <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-dashed border-primary text-primary hover:bg-primary/5"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ 
                                ...newAddress, 
                                phone: e.target.value.replace(/\D/g, "").slice(0, 10) 
                              })}
                              placeholder="10-digit mobile"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="addressLine1">Address Line 1 *</Label>
                          <Input
                            id="addressLine1"
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            placeholder="House No., Building Name, Street"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                          <Input
                            id="addressLine2"
                            value={newAddress.addressLine2}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                            placeholder="Area, Colony, Landmark"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              placeholder="Enter city"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                              id="pincode"
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress({ 
                                ...newAddress, 
                                pincode: e.target.value.replace(/\D/g, "").slice(0, 6) 
                              })}
                              placeholder="6-digit pincode"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Select
                              value={newAddress.state}
                              onValueChange={(value) => setNewAddress({ ...newAddress, state: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Address Type</Label>
                            <Select
                              value={newAddress.type}
                              onValueChange={(value: "home" | "work" | "other") => 
                                setNewAddress({ ...newAddress, type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button onClick={handleAddAddress} className="w-full bg-[#fb641b] hover:bg-[#e85a19]">
                          Save Address
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {selectedAddress && (
                    <Button
                      onClick={() => setCurrentStep("payment")}
                      className="w-full mt-4 bg-[#fb641b] hover:bg-[#e85a19] h-12 font-semibold"
                    >
                      DELIVER HERE
                    </Button>
                  )}
                </div>
              )}

              {/* Collapsed address view */}
              {currentStep !== "address" && selectedAddress && (
                <div className="px-5 py-3 bg-white">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">{selectedAddress.name}</span>
                      <span className="text-muted-foreground mx-2">|</span>
                      <span>{selectedAddress.phone}</span>
                      <p className="text-muted-foreground mt-1">
                        {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div 
                className={`px-5 py-3 flex items-center justify-between ${
                  currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold ${
                    currentStep === "payment" ? "bg-white text-primary" : 
                    currentStep === "review" ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
                  }`}>
                    {currentStep === "review" ? <Check className="h-4 w-4" /> : "2"}
                  </span>
                  <span className="font-semibold text-sm">PAYMENT OPTIONS</span>
                </div>
                {currentStep === "review" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("payment")}
                    className="text-primary h-7"
                  >
                    CHANGE
                  </Button>
                )}
              </div>

              {currentStep === "payment" && (
                <div className="p-5">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: "cod" | "upi" | "card") => setPaymentMethod(value)}
                    className="space-y-3"
                  >
                    {/* Cash on Delivery */}
                    <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
                    }`}>
                      <RadioGroupItem value="cod" id="cod" className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-sm">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay with cash when your order is delivered
                        </p>
                      </div>
                    </label>

                    {/* UPI */}
                    <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
                    }`}>
                      <RadioGroupItem value="upi" id="upi" className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-sm">UPI</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Extra 5% Off
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pay using Google Pay, PhonePe, Paytm or any UPI app
                        </p>
                      </div>
                    </label>

                    {/* Card */}
                    <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
                    }`}>
                      <RadioGroupItem value="card" id="card" className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-sm">Credit / Debit Card</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          10% instant discount with HDFC Bank cards
                        </p>
                      </div>
                    </label>
                  </RadioGroup>

                  <Button
                    onClick={() => setCurrentStep("review")}
                    className="w-full mt-4 bg-[#fb641b] hover:bg-[#e85a19] h-12 font-semibold"
                  >
                    CONTINUE
                  </Button>
                </div>
              )}

              {/* Collapsed payment view */}
              {currentStep === "review" && (
                <div className="px-5 py-3 bg-white">
                  <div className="flex items-center gap-2 text-sm">
                    {paymentMethod === "cod" && <Banknote className="h-4 w-4 text-green-600" />}
                    {paymentMethod === "upi" && <Smartphone className="h-4 w-4 text-purple-600" />}
                    {paymentMethod === "card" && <CreditCard className="h-4 w-4 text-blue-600" />}
                    <span className="font-medium">
                      {paymentMethod === "cod" && "Cash on Delivery"}
                      {paymentMethod === "upi" && "UPI Payment"}
                      {paymentMethod === "card" && "Credit / Debit Card"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Review & Place Order */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div 
                className={`px-5 py-3 ${
                  currentStep === "review" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold ${
                    currentStep === "review" ? "bg-white text-primary" : "bg-gray-300 text-gray-600"
                  }`}>
                    3
                  </span>
                  <span className="font-semibold text-sm">REVIEW ORDER & PLACE</span>
                </div>
              </div>

              {currentStep === "review" && (
                <div className="p-5">
                  {/* Order items */}
                  <div className="space-y-4 mb-4">
                    {items.map((item) => {
                      const discount = calculateDiscount(item.originalPrice, item.price)
                      return (
                        <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                          <Link href={`/product/${item.id}`} className="flex-shrink-0">
                            <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold">{formatPrice(item.price)}</span>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                              {discount > 0 && (
                                <span className="text-xs font-semibold text-green-600">
                                  {discount}% off
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Delivery info */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-sm mb-4">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Estimated delivery by <span className="font-semibold">Tomorrow, 10 AM</span>
                    </span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#fb641b] hover:bg-[#e85a19] h-12 font-semibold"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        Processing...
                      </span>
                    ) : (
                      `PLACE ORDER (${formatPrice(finalAmount)})`
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By placing this order, you agree to FlipKart's{" "}
                    <span className="text-primary cursor-pointer">Terms of Use</span> and{" "}
                    <span className="text-primary cursor-pointer">Privacy Policy</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Price summary sidebar */}
          <div className="lg:sticky lg:top-20 space-y-3">
            {/* Coupon */}
            <div className="bg-card border border-border rounded-sm px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Apply Coupon</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 text-sm h-9"
                />
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                  Apply
                </Button>
              </div>
            </div>

            {/* Price details */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <button
                onClick={() => setOrderExpanded(!orderExpanded)}
                className="w-full px-5 py-3 border-b border-border bg-muted/50 flex items-center justify-between"
              >
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Price Details ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
                {orderExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {orderExpanded && (
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm text-foreground">
                    <span>Price ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>{formatPrice(totalOriginalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Discount</span>
                    <span className="text-green-600 font-medium">
                      - {formatPrice(totalDiscount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-foreground">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                      {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">Total Amount</span>
                    <span className="text-base font-bold text-foreground">
                      {formatPrice(finalAmount)}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="bg-green-50 rounded-sm px-3 py-2 text-sm font-medium text-green-700 text-center">
                      You will save {formatPrice(totalDiscount)} on this order
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
              <Shield className="h-4 w-4 text-green-600" />
              Safe and Secure Payments. Easy returns.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
