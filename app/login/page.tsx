"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Mail, Lock, Phone, ArrowRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type LoginMode = "phone" | "email"
type AuthView = "login" | "otp" | "signup"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<LoginMode>("phone")
  const [view, setView] = useState<AuthView>("login")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 10) {
      setIsLoading(true)
      // Simulate OTP send
      setTimeout(() => {
        setIsLoading(false)
        setView("otp")
      }, 1000)
    }
  }

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      setIsLoading(true)
      // Simulate verification
      setTimeout(() => {
        setIsLoading(false)
        router.push("/")
      }, 1000)
    }
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Simulate Google login
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-[#2874f0] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[750px] bg-white rounded-sm shadow-lg flex overflow-hidden min-h-[500px]">
        {/* Left panel - Blue section */}
        <div className="hidden md:flex md:w-[40%] bg-[#2874f0] p-8 flex-col text-white">
          <h2 className="text-2xl font-bold mb-4">
            {view === "signup" ? "Looks like you're new here!" : "Login"}
          </h2>
          <p className="text-sm text-white/90 leading-relaxed">
            {view === "signup"
              ? "Sign up with your mobile number to get started"
              : "Get access to your Orders, Wishlist and Recommendations"}
          </p>
          <div className="mt-auto">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop"
              alt="Shopping"
              width={200}
              height={150}
              className="opacity-90 rounded-sm"
            />
          </div>
        </div>

        {/* Right panel - Form section */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          {/* Back button for OTP view */}
          {view === "otp" && (
            <button
              onClick={() => setView("login")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {/* Mode toggle for login view */}
          {view === "login" && (
            <div className="flex gap-4 mb-6 border-b border-border">
              <button
                onClick={() => setMode("phone")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === "phone"
                    ? "border-[#2874f0] text-[#2874f0]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setMode("email")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === "email"
                    ? "border-[#2874f0] text-[#2874f0]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Email
              </button>
            </div>
          )}

          {/* Phone Login */}
          {view === "login" && mode === "phone" && (
            <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">
                  Enter Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to Flipkard's{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                disabled={phone.length !== 10 || isLoading}
                className="w-full bg-[#fb641b] hover:bg-[#e85a18] text-white py-5 font-semibold"
              >
                {isLoading ? "Sending OTP..." : "Request OTP"}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted-foreground">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <button
                type="button"
                onClick={() => setView("signup")}
                className="text-sm text-[#2874f0] font-medium hover:underline text-center mt-2"
              >
                New to Flipkard? Create an account
              </button>
            </form>
          )}

          {/* Email Login */}
          {view === "login" && mode === "email" && (
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Enter Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  Enter Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-[#2874f0]" />
                  Remember me
                </label>
                <Link href="#" className="text-sm text-[#2874f0] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to Flipkard's{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                disabled={!email || !password || isLoading}
                className="w-full bg-[#fb641b] hover:bg-[#e85a18] text-white py-5 font-semibold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted-foreground">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <button
                type="button"
                onClick={() => setView("signup")}
                className="text-sm text-[#2874f0] font-medium hover:underline text-center mt-2"
              >
                New to Flipkard? Create an account
              </button>
            </form>
          )}

          {/* OTP Verification */}
          {view === "otp" && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-foreground">Verify with OTP</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sent to +91 {phone}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Enter OTP</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Didn't receive?</span>
                <button
                  type="button"
                  className="text-[#2874f0] font-medium hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <Button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className="w-full bg-[#fb641b] hover:bg-[#e85a18] text-white py-5 font-semibold mt-2"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {view === "signup" && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground -ml-1 mb-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Login
              </button>

              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="py-5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-sm text-muted-foreground">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm text-muted-foreground">
                  Create Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-5"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By signing up, you agree to Flipkard's{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#2874f0] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                disabled={!name || phone.length !== 10 || !email || !password || isLoading}
                className="w-full bg-[#fb641b] hover:bg-[#e85a18] text-white py-5 font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted-foreground">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
