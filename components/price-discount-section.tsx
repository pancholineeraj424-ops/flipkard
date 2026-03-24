"use client"

import { useState } from "react"
import {
  Tag,
  CreditCard,
  Percent,
  BadgePercent,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wallet,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice, calculateDiscount } from "@/lib/products"
import { toast } from "sonner"

interface PriceDiscountSectionProps {
  price: number
  originalPrice: number
  productName?: string
}

const bankOffers = [
  {
    id: 1,
    bank: "HDFC Bank",
    discount: "10% Instant Discount",
    description: "on HDFC Bank Credit Cards, up to Rs. 1500",
    code: "HDFC10",
  },
  {
    id: 2,
    bank: "ICICI Bank",
    discount: "5% Cashback",
    description: "on ICICI Bank Credit Cards EMI, up to Rs. 1000",
    code: "ICICI5",
  },
  {
    id: 3,
    bank: "SBI Card",
    discount: "Rs. 500 Off",
    description: "on orders above Rs. 5000 with SBI Credit Cards",
    code: "SBI500",
  },
  {
    id: 4,
    bank: "Axis Bank",
    discount: "7.5% Discount",
    description: "on Axis Bank Buzz Credit Card EMI",
    code: "AXIS75",
  },
]

const availableCoupons = [
  { code: "FIRST50", discount: 50, minOrder: 499, description: "Flat Rs. 50 off on first order" },
  { code: "SAVE100", discount: 100, minOrder: 999, description: "Flat Rs. 100 off on orders above Rs. 999" },
  { code: "MEGA200", discount: 200, minOrder: 1999, description: "Flat Rs. 200 off on orders above Rs. 1999" },
]

export function PriceDiscountSection({ price, originalPrice, productName }: PriceDiscountSectionProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<typeof availableCoupons[0] | null>(null)
  const [showAllOffers, setShowAllOffers] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const discount = calculateDiscount(originalPrice, price)
  const savings = originalPrice - price
  const finalPrice = appliedCoupon ? price - appliedCoupon.discount : price
  const emiAmount = Math.round(finalPrice / 12)

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      return
    }

    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    )

    if (coupon) {
      if (price >= coupon.minOrder) {
        setAppliedCoupon(coupon)
        toast.success(`Coupon "${coupon.code}" applied! You save Rs. ${coupon.discount}`)
      } else {
        toast.error(`Minimum order value Rs. ${coupon.minOrder} required for this coupon`)
      }
    } else {
      toast.error("Invalid coupon code")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast.success("Coupon removed")
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Code "${code}" copied!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const displayedOffers = showAllOffers ? bankOffers : bankOffers.slice(0, 2)

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      {/* Special Price Badge */}
      <div className="bg-gradient-to-r from-[#388e3c] to-[#4caf50] px-4 py-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-bold">Special Price</span>
        <span className="text-white/80 text-xs">Limited Time Deal</span>
      </div>

      <div className="p-4 md:p-5">
        {/* Price Display */}
        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="text-3xl md:text-4xl font-bold text-foreground">
              {formatPrice(finalPrice)}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-lg font-bold text-[#388e3c]">
              {discount}% off
            </span>
          </div>

          {/* Savings */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-success font-semibold flex items-center gap-1">
              <Tag className="h-4 w-4" />
              You save {formatPrice(savings + (appliedCoupon?.discount || 0))}
            </span>
            {appliedCoupon && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">
                + Rs. {appliedCoupon.discount} coupon discount
              </span>
            )}
          </div>

          {/* Tax Info */}
          <p className="text-xs text-muted-foreground mt-2">
            Inclusive of all taxes
          </p>
        </div>

        {/* EMI Option */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-sm mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-foreground">
              EMI from {formatPrice(emiAmount)}/month
            </span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              No Cost EMI available on select cards
            </span>
          </div>
          <Button variant="link" className="text-primary text-xs p-0 h-auto">
            View Plans
          </Button>
        </div>

        {/* Coupon Section */}
        <div className="mb-4 pb-4 border-b border-border">
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <BadgePercent className="h-4 w-4 text-[#fb641b]" />
            Apply Coupon
          </h4>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <span className="text-sm font-bold text-success">{appliedCoupon.code}</span>
                  <span className="text-xs text-muted-foreground block">
                    {appliedCoupon.description}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 uppercase"
                />
                <Button
                  onClick={handleApplyCoupon}
                  className="px-6 h-10 bg-[#fb641b] hover:bg-[#e85a19]"
                >
                  Apply
                </Button>
              </div>

              {/* Available Coupons */}
              <div className="space-y-2">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 border border-dashed border-primary bg-primary/5 rounded">
                        <span className="text-xs font-bold text-primary">{coupon.code}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{coupon.description}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="h-7 px-2"
                    >
                      {copiedCode === coupon.code ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bank Offers */}
        <div>
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Bank Offers
          </h4>

          <div className="space-y-2">
            {displayedOffers.map((offer) => (
              <div key={offer.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-sm">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Percent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{offer.discount}</span>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{offer.bank}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{offer.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(offer.code)}
                  className="h-7 px-2 text-xs text-primary"
                >
                  {copiedCode === offer.code ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      {offer.code}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {bankOffers.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllOffers(!showAllOffers)}
              className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/5"
            >
              {showAllOffers ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  View All {bankOffers.length} Offers <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
