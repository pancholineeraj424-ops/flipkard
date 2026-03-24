"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  Shield,
  Truck,
  Package,
  CheckCircle2,
  Plus,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth, Address } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"
import { formatPrice, calculateDiscount } from "@/lib/products"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type CheckoutStep = "address" | "payment" | "review"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated, addAddress } = useAuth()
  const { createOrder } = useOrders()
  const [step, setStep] = useState<CheckoutStep>("address")
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [orderId, setOrderId] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("upi")
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Get user addresses
  const savedAddresses = user?.addresses || []
  
  // Set default address on mount
  useState(() => {
    const defaultAddr = savedAddresses.find(a => a.isDefault)
    if (defaultAddr && !selectedAddressId) {
      setSelectedAddressId(defaultAddr.id)
    } else if (savedAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(savedAddresses[0].id)
    }
  })

  // Address form state
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: user?.name || "",
    phone: user?.phone || "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    type: "home",
    isDefault: false
  })

  const [expandedSection, setExpandedSection] = useState<CheckoutStep>("address")

  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const totalDiscount = totalOriginalPrice - totalPrice
  const deliveryCharge = totalPrice > 499 ? 0 : 49
  const finalAmount = totalPrice + deliveryCharge
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center gap-5 text-center">
        <Package className="w-20 h-20 text-muted-foreground opacity-30" />
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Add items to your cart to checkout
          </p>
        </div>
        <Link
          href="/products"
          className="bg-primary text-primary-foreground px-10 py-3 text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  // Order success view
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Your order has been confirmed and will be shipped soon. You will receive an email confirmation shortly.
          </p>
        </div>
        <div className="bg-card border border-border rounded-sm p-6 w-full">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="font-mono font-bold text-foreground">{orderId}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-bold text-foreground">{formatPrice(finalAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expected Delivery</span>
            <span className="font-semibold text-success">Within 3-5 business days</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/orders/${orderId}`}
            className="px-6 py-3 text-sm font-medium border border-primary text-primary rounded-sm hover:bg-primary/5 transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/products"
            className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error("Please login to place order")
      router.push("/login?redirect=/checkout")
      return
    }

    const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    setIsProcessing(true)
    
    // Create order
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)
    
    const order = createOrder({
      userId: user.id,
      items: items,
      address: selectedAddress,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: "pending",
      subtotal: totalOriginalPrice,
      discount: totalDiscount,
      deliveryCharge: deliveryCharge,
      total: finalAmount,
      estimatedDelivery: estimatedDelivery.toISOString().split('T')[0]
    })

    setTimeout(() => {
      setIsProcessing(false)
      setOrderId(order.id)
      setOrderPlaced(true)
      clearCart()
      toast.success("Order placed successfully!")
    }, 1500)
  }

  const SectionHeader = ({
    number,
    title,
    section,
    isCompleted,
  }: {
    number: number
    title: string
    section: CheckoutStep
    isCompleted: boolean
  }) => (
    <button
      onClick={() => isCompleted && setExpandedSection(section)}
      className={`w-full flex items-center gap-4 px-5 py-4 ${
        isCompleted ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <span
        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
          isCompleted || expandedSection === section
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : number}
      </span>
      <span className={`font-bold text-sm uppercase tracking-wide ${
        expandedSection === section ? "text-primary" : "text-foreground"
      }`}>
        {title}
      </span>
      {isCompleted && expandedSection !== section && (
        <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
      )}
      {expandedSection === section && (
        <ChevronUp className="h-4 w-4 ml-auto text-primary" />
      )}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cart" className="hover:text-primary">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
        {/* Main checkout sections */}
        <div className="flex flex-col gap-3">
          {/* Login section */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4 bg-primary/5">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {isAuthenticated ? <CheckCircle2 className="h-4 w-4" /> : "1"}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm uppercase tracking-wide text-foreground">
                  Login
                </span>
                {isAuthenticated && user ? (
                  <span className="text-sm text-muted-foreground">{user.name}, +91 {user.phone}</span>
                ) : (
                  <Link href="/login?redirect=/checkout" className="text-sm text-primary font-medium hover:underline">
                    Login to continue
                  </Link>
                )}
              </div>
              {isAuthenticated && (
                <Link href="/login" className="ml-auto text-sm text-primary font-medium hover:underline">
                  Change
                </Link>
              )}
            </div>
          </div>

          {/* Address section */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <SectionHeader
              number={2}
              title="Delivery Address"
              section="address"
              isCompleted={step !== "address"}
            />
            
            {expandedSection === "address" && (
              <div className="px-5 pb-5">
                {/* Saved addresses */}
                {savedAddresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3">
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`border rounded-sm p-4 cursor-pointer transition-colors ${
                            selectedAddressId === addr.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <label className="flex items-start gap-3 cursor-pointer">
                            <RadioGroupItem value={addr.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-foreground">{addr.name}</span>
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase">
                                  {addr.type}
                                </span>
                                <span className="text-sm text-muted-foreground">{addr.phone}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </button>

                    <Button
                      onClick={() => {
                        setStep("payment")
                        setExpandedSection("payment")
                      }}
                      disabled={!selectedAddressId}
                      className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e85a18] text-white font-semibold"
                    >
                      Deliver Here
                    </Button>
                  </div>
                )}

                {/* New address form */}
                {showAddressForm && (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Input
                          id="phone"
                          placeholder="10-digit number"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="6-digit pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="locality">Locality</Label>
                        <Input
                          id="locality"
                          placeholder="Locality / Area"
                          value={newAddress.locality}
                          onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address (Area and Street)</Label>
                      <textarea
                        id="address"
                        placeholder="Complete address"
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <RadioGroup
                        value={newAddress.type}
                        onValueChange={(value) => setNewAddress({ ...newAddress, type: value as "home" | "work" })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="home" id="type-home" />
                          <Label htmlFor="type-home" className="cursor-pointer">Home</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="work" id="type-work" />
                          <Label htmlFor="type-work" className="cursor-pointer">Work</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={() => {
                          if (newAddress.name && newAddress.phone && newAddress.address && newAddress.city && newAddress.state && newAddress.pincode) {
                            addAddress({
                              name: newAddress.name,
                              phone: newAddress.phone,
                              pincode: newAddress.pincode,
                              locality: newAddress.locality || "",
                              address: newAddress.address,
                              city: newAddress.city,
                              state: newAddress.state,
                              type: newAddress.type || "home",
                              isDefault: savedAddresses.length === 0
                            })
                            setShowAddressForm(false)
                            toast.success("Address saved!")
                          } else {
                            toast.error("Please fill all required fields")
                          }
                        }}
                        className="bg-[#fb641b] hover:bg-[#e85a18] text-white font-semibold"
                      >
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Payment section */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <SectionHeader
              number={3}
              title="Payment Options"
              section="payment"
              isCompleted={step === "review"}
            />

            {expandedSection === "payment" && step !== "address" && (
              <div className="px-5 pb-5">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {/* UPI */}
                  <div
                    className={`border rounded-sm p-4 transition-colors ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem value="upi" />
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-sm text-foreground">UPI</span>
                      <div className="ml-auto flex items-center gap-2">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" width={40} height={16} className="h-4 w-auto" />
                      </div>
                    </label>
                    {paymentMethod === "upi" && (
                      <div className="mt-4 ml-8 space-y-3">
                        <div className="flex gap-3">
                          <Input
                            placeholder="Enter UPI ID (e.g., name@upi)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="max-w-sm"
                          />
                          <Button variant="outline" size="sm">Verify</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          We support Google Pay, PhonePe, Paytm & all UPI apps
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Credit/Debit Card */}
                  <div
                    className={`border rounded-sm p-4 transition-colors ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem value="card" />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-sm text-foreground">Credit / Debit Card</span>
                    </label>
                    {paymentMethod === "card" && (
                      <div className="mt-4 ml-8 space-y-3">
                        <Input placeholder="Card Number" className="max-w-sm" />
                        <div className="flex gap-3 max-w-sm">
                          <Input placeholder="MM/YY" className="w-24" />
                          <Input placeholder="CVV" type="password" className="w-20" />
                        </div>
                        <Input placeholder="Name on Card" className="max-w-sm" />
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div
                    className={`border rounded-sm p-4 transition-colors ${
                      paymentMethod === "netbanking" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem value="netbanking" />
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-sm text-foreground">Net Banking</span>
                    </label>
                    {paymentMethod === "netbanking" && (
                      <div className="mt-4 ml-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {["HDFC", "ICICI", "SBI", "Axis"].map((bank) => (
                          <button
                            key={bank}
                            className="border border-border rounded-sm px-3 py-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`border rounded-sm p-4 transition-colors ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem value="cod" />
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-sm text-foreground">Cash on Delivery</span>
                    </label>
                    {paymentMethod === "cod" && (
                      <p className="mt-3 ml-8 text-xs text-muted-foreground">
                        Pay in cash when your order is delivered. Additional charges may apply.
                      </p>
                    )}
                  </div>
                </RadioGroup>

                <Button
                  onClick={() => {
                    setStep("review")
                    setExpandedSection("review")
                  }}
                  className="mt-4 bg-[#fb641b] hover:bg-[#e85a18] text-white font-semibold"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>

          {/* Order Review / Place Order */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <SectionHeader
              number={4}
              title="Review Order"
              section="review"
              isCompleted={false}
            />

            {expandedSection === "review" && step === "review" && (
              <div className="px-5 pb-5">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0">
                      <div className="relative w-16 h-16 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    Order confirmation email will be sent to johndoe@email.com
                  </p>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e85a18] text-white font-bold py-5 px-10"
                  >
                    {isProcessing ? "Processing..." : `Place Order - ${formatPrice(finalAmount)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:sticky lg:top-20">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Order Summary
              </h3>
            </div>

            {/* Items preview */}
            <div className="px-5 py-4 border-b border-border max-h-48 overflow-y-auto">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 mb-3 last:mb-0">
                  <div className="relative w-12 h-12 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-xs text-primary">+{items.length - 3} more items</p>
              )}
            </div>

            {/* Price details */}
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Price ({totalItems} items)</span>
                <span>{formatPrice(totalOriginalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">Discount</span>
                <span className="text-success font-medium">- {formatPrice(totalDiscount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? "text-success font-medium" : ""}>
                  {deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-base font-bold text-foreground">{formatPrice(finalAmount)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="bg-success/10 rounded-sm px-3 py-2 text-xs font-medium text-success text-center">
                  You save {formatPrice(totalDiscount)} on this order
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="px-5 pb-5 flex items-center justify-center gap-6 border-t border-border pt-4">
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
