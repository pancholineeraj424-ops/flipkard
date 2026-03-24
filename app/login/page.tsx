"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Phone, Mail, ArrowRight, ChevronLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Suspense } from "react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const { login, loginWithOTP, signup } = useAuth()

  const [mode, setMode] = useState<"login" | "signup" | "otp">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push(redirect)
      } else {
        setError("Invalid email or password")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const success = await signup(name, email, password, phone)
      if (success) {
        router.push(redirect)
      } else {
        setError("Failed to create account")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }
    setError("")
    setIsLoading(true)
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000))
    setOtpSent(true)
    setIsLoading(false)
  }

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await loginWithOTP(phone, otp)
      if (success) {
        router.push(redirect)
      } else {
        setError("Invalid OTP")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2874f0] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[750px] bg-white rounded-sm shadow-xl flex overflow-hidden min-h-[500px]">
        {/* Left panel - branding */}
        <div className="hidden md:flex flex-col w-[280px] bg-[#2874f0] p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            {mode === "login" ? "Login" : mode === "signup" ? "Looks like you're new here!" : "Login with OTP"}
          </h2>
          <p className="text-sm text-white/80 leading-relaxed mb-8">
            {mode === "login"
              ? "Get access to your Orders, Wishlist and Recommendations"
              : mode === "signup"
              ? "Sign up with your email to get started"
              : "Enter your phone number to receive a one-time password"}
          </p>
          <div className="mt-auto">
            <Image
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
              alt="FlipKart Login"
              width={200}
              height={140}
              className="opacity-90"
            />
          </div>
        </div>

        {/* Right panel - form */}
        <div className="flex-1 p-8 flex flex-col">
          {/* Mobile header */}
          <div className="md:hidden mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ChevronLeft className="h-4 w-4" />
              Back to FlipKart
            </Link>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-4 mb-6 border-b border-border">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                mode === "login"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email Login
            </button>
            <button
              onClick={() => { setMode("otp"); setError(""); setOtpSent(false); }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                mode === "otp"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4 inline mr-2" />
              OTP Login
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to FlipKart's{" "}
                <span className="text-primary cursor-pointer">Terms of Use</span> and{" "}
                <span className="text-primary cursor-pointer">Privacy Policy</span>.
              </p>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#fb641b] hover:bg-[#e85a19] text-white font-semibold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">OR</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-primary text-primary hover:bg-primary/5 font-semibold"
                onClick={() => setMode("signup")}
              >
                New to FlipKart? Create an account
              </Button>

              {/* Demo credentials */}
              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-2">Demo credentials:</p>
                <p className="text-xs text-center font-mono bg-muted p-2 rounded">
                  Email: demo@flipkart.com | Password: demo123
                </p>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to FlipKart's{" "}
                <span className="text-primary cursor-pointer">Terms of Use</span> and{" "}
                <span className="text-primary cursor-pointer">Privacy Policy</span>.
              </p>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#fb641b] hover:bg-[#e85a19] text-white font-semibold"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-primary"
                onClick={() => setMode("login")}
              >
                Already have an account? Login
              </Button>
            </form>
          )}

          {/* OTP Login Form */}
          {mode === "otp" && (
            <form onSubmit={handleOTPLogin} className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="w-16 h-11 bg-muted rounded-sm flex items-center justify-center text-sm font-medium">
                    +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    required
                    disabled={otpSent}
                    className="h-11 flex-1"
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading || phone.length !== 10}
                  className="w-full h-12 bg-[#fb641b] hover:bg-[#e85a19] text-white font-semibold"
                >
                  {isLoading ? "Sending OTP..." : "Request OTP"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      className="h-11 text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      OTP sent to +91 {phone}.{" "}
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(""); }}
                        className="text-primary hover:underline"
                      >
                        Change
                      </button>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-12 bg-[#fb641b] hover:bg-[#e85a19] text-white font-semibold"
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Didn't receive OTP?{" "}
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                </>
              )}

              {/* Demo info */}
              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  For demo, enter any 10-digit phone and any 6-digit OTP
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
