"use client"

import { useState, useEffect, useRef } from "react"
import { X, Smartphone, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import type { ConfirmationResult, RecaptchaVerifierType } from "@/lib/firebase"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "phone" | "otp" | "success"

const OTP_LENGTH = 4
const RESEND_TIMER = 30
const MAX_OTP_ATTEMPTS = 5

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [step, setStep] = useState<Step>("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(true)
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const recaptchaRef = useRef<RecaptchaVerifierType | null>(null)
  const confirmationResultRef = useRef<ConfirmationResult | null>(null)
  
  const { login } = useAuth()

  // Check if demo mode on mount
  useEffect(() => {
    const checkDemoMode = async () => {
      const firebase = await import("@/lib/firebase")
      setIsDemoMode(firebase.isDemoMode)
    }
    checkDemoMode()
  }, [])

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("phone")
        setPhoneNumber("")
        setOtp(Array(OTP_LENGTH).fill(""))
        setError("")
        setResendTimer(0)
        setOtpAttempts(0)
      }, 300)
    }
  }, [open])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Setup reCAPTCHA when on phone step
  useEffect(() => {
    if (open && step === "phone" && !isDemoMode) {
      const setupRecaptchaVerifier = async () => {
        const { setupRecaptcha } = await import("@/lib/firebase")
        const verifier = await setupRecaptcha("recaptcha-container")
        recaptchaRef.current = verifier
      }
      setupRecaptchaVerifier()
    }
  }, [open, step, isDemoMode])

  const validatePhoneNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, "")
    return cleaned.length === 10 && /^[6-9]/.test(cleaned)
  }

  const handleSendOTP = async () => {
    setError("")
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode - simulate OTP send
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStep("otp")
        setResendTimer(RESEND_TIMER)
      } else {
        const { sendOTP } = await import("@/lib/firebase")
        const confirmation = await sendOTP(phoneNumber, recaptchaRef.current)
        confirmationResultRef.current = confirmation
        setStep("otp")
        setResendTimer(RESEND_TIMER)
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits entered
    if (newOtp.every((digit) => digit) && newOtp.join("").length === OTP_LENGTH) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (pastedData.length === OTP_LENGTH) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      otpInputRefs.current[OTP_LENGTH - 1]?.focus()
      handleVerifyOTP(pastedData)
    }
  }

  const handleVerifyOTP = async (otpCode: string) => {
    if (otpAttempts >= MAX_OTP_ATTEMPTS) {
      setError("Too many attempts. Please request a new OTP.")
      return
    }

    setIsLoading(true)
    setOtpAttempts((prev) => prev + 1)

    try {
      const { verifyOTP } = await import("@/lib/firebase")
      const isValid = await verifyOTP(confirmationResultRef.current, otpCode)
      
      if (isValid) {
        login(phoneNumber)
        setStep("success")
        setTimeout(() => {
          onOpenChange(false)
        }, 1500)
      } else {
        setError("Invalid OTP. Please try again.")
        setOtp(Array(OTP_LENGTH).fill(""))
        otpInputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    setOtp(Array(OTP_LENGTH).fill(""))
    setOtpAttempts(0)
    setError("")
    await handleSendOTP()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Login to FlipKard</DialogTitle>
        
        {/* Header */}
        <div className="bg-[#2874f0] text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {step === "phone" && "Login"}
                {step === "otp" && "Verify OTP"}
                {step === "success" && "Success!"}
              </h2>
              <p className="text-sm text-white/80">
                {step === "phone" && "Get access to your Orders, Wishlist and Recommendations"}
                {step === "otp" && `OTP sent to +91 ${phoneNumber}`}
                {step === "success" && "You are now logged in"}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "phone" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-sm text-sm text-gray-600 border border-gray-200">
                    <span>+91</span>
                  </div>
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                        setPhoneNumber(value)
                        setError("")
                      }}
                      className="pl-10"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {isDemoMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 text-sm text-amber-800">
                  <strong>Demo Mode:</strong> Firebase not configured. Enter any valid number and use OTP <code className="bg-amber-100 px-1 rounded">1234</code> to verify.
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full bg-[#fb641b] hover:bg-[#f85606] text-white font-medium py-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Request OTP"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to FlipKard's{" "}
                <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{" "}
                <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
              </p>

              <div id="recaptcha-container" />
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter {OTP_LENGTH}-digit OTP
                </label>
                <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 focus:border-[#2874f0] focus:ring-[#2874f0] rounded-lg"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-[#2874f0] text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying OTP...
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep("phone")}
                  className="text-[#2874f0] hover:underline"
                >
                  Change Number
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className={`${
                    resendTimer > 0 ? "text-gray-400" : "text-[#2874f0] hover:underline"
                  }`}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>

              {otpAttempts > 0 && otpAttempts < MAX_OTP_ATTEMPTS && (
                <p className="text-xs text-gray-500 text-center">
                  Attempts remaining: {MAX_OTP_ATTEMPTS - otpAttempts}
                </p>
              )}

              <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                OTP is securely verified
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Login Successful!
              </h3>
              <p className="text-sm text-gray-600">
                Welcome to FlipKard
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
