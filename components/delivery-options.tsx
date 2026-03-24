"use client"

import { useState } from "react"
import {
  Truck,
  Zap,
  RotateCcw,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
  Package,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DeliveryOptionsProps {
  productPrice: number
}

const validPincodes: Record<string, { city: string; deliveryDays: number; expressAvailable: boolean }> = {
  "110001": { city: "New Delhi", deliveryDays: 2, expressAvailable: true },
  "400001": { city: "Mumbai", deliveryDays: 2, expressAvailable: true },
  "560001": { city: "Bangalore", deliveryDays: 2, expressAvailable: true },
  "700001": { city: "Kolkata", deliveryDays: 3, expressAvailable: true },
  "600001": { city: "Chennai", deliveryDays: 3, expressAvailable: true },
  "500001": { city: "Hyderabad", deliveryDays: 2, expressAvailable: true },
  "380001": { city: "Ahmedabad", deliveryDays: 3, expressAvailable: true },
  "411001": { city: "Pune", deliveryDays: 3, expressAvailable: true },
  "302001": { city: "Jaipur", deliveryDays: 4, expressAvailable: false },
  "226001": { city: "Lucknow", deliveryDays: 4, expressAvailable: false },
  "440001": { city: "Nagpur", deliveryDays: 4, expressAvailable: false },
  "201301": { city: "Noida", deliveryDays: 2, expressAvailable: true },
  "122001": { city: "Gurgaon", deliveryDays: 2, expressAvailable: true },
}

export function DeliveryOptions({ productPrice }: DeliveryOptionsProps) {
  const [pincode, setPincode] = useState("")
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean
    city?: string
    deliveryDays?: number
    expressAvailable?: boolean
    checked: boolean
  }>({ available: false, checked: false })

  const handleCheckPincode = () => {
    if (pincode.length !== 6) {
      setDeliveryInfo({ available: false, checked: true })
      return
    }

    const info = validPincodes[pincode]
    if (info) {
      setDeliveryInfo({
        available: true,
        city: info.city,
        deliveryDays: info.deliveryDays,
        expressAvailable: info.expressAvailable,
        checked: true,
      })
    } else {
      // For demo, allow any 6-digit pincode with default delivery
      if (/^\d{6}$/.test(pincode)) {
        setDeliveryInfo({
          available: true,
          city: "Your Location",
          deliveryDays: 5,
          expressAvailable: false,
          checked: true,
        })
      } else {
        setDeliveryInfo({ available: false, checked: true })
      }
    }
  }

  const getDeliveryDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const freeDelivery = productPrice >= 500
  const deliveryCharge = freeDelivery ? 0 : 40
  const expressCharge = 99

  return (
    <div className="bg-card border border-border rounded-sm p-4 md:p-5">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <Truck className="h-4 w-4 text-primary" />
        Delivery Options
      </h3>

      {/* Pincode Input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6)
              setPincode(value)
              if (value.length < 6) {
                setDeliveryInfo({ available: false, checked: false })
              }
            }}
            className="pl-9 h-10"
            maxLength={6}
          />
        </div>
        <Button
          onClick={handleCheckPincode}
          variant="outline"
          className="px-6 h-10 font-semibold text-primary border-primary hover:bg-primary/5"
        >
          Check
        </Button>
      </div>

      {/* Delivery Status */}
      {deliveryInfo.checked && (
        <div className={`p-3 rounded-sm mb-4 ${deliveryInfo.available ? "bg-success/10" : "bg-destructive/10"}`}>
          {deliveryInfo.available ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-success">
                  Delivery available to {deliveryInfo.city}
                </span>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  Pincode: {pincode}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <span className="text-sm font-semibold text-destructive">
                Please enter a valid 6-digit pincode
              </span>
            </div>
          )}
        </div>
      )}

      {/* Delivery Options List */}
      <div className="space-y-3">
        {/* Standard Delivery */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Standard Delivery</span>
              {freeDelivery ? (
                <span className="text-sm font-bold text-success">FREE</span>
              ) : (
                <span className="text-sm font-semibold text-foreground">Rs. {deliveryCharge}</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {deliveryInfo.available && deliveryInfo.deliveryDays
                  ? `Delivery by ${getDeliveryDate(deliveryInfo.deliveryDays)}`
                  : "Usually delivered in 3-5 days"}
              </span>
            </div>
            {!freeDelivery && (
              <span className="text-xs text-muted-foreground mt-1 block">
                Free delivery on orders above Rs. 500
              </span>
            )}
          </div>
        </div>

        {/* Express Delivery */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-[#fb641b]/10 flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-[#fb641b]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Express Delivery</span>
                <span className="text-[10px] font-bold bg-[#fb641b] text-white px-1.5 py-0.5 rounded">
                  FAST
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">Rs. {expressCharge}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {deliveryInfo.available && deliveryInfo.expressAvailable
                  ? `Delivery by Tomorrow, ${getDeliveryDate(1)}`
                  : "1-day delivery (Metro cities only)"}
              </span>
            </div>
            {deliveryInfo.checked && !deliveryInfo.expressAvailable && deliveryInfo.available && (
              <span className="text-xs text-destructive mt-1 block">
                Express delivery not available for this pincode
              </span>
            )}
          </div>
        </div>

        {/* Cash on Delivery */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <Banknote className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Cash on Delivery</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded">
                AVAILABLE
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">
              Pay when your order arrives at your doorstep
            </span>
          </div>
        </div>

        {/* Return Policy */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">7 Days Return & Exchange</span>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">
              Easy return and exchange within 7 days of delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
