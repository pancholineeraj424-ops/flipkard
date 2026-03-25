"use client"

import type { FirebaseApp } from "firebase/app"
import type { Auth, ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth"

// Check if Firebase is configured
const hasValidConfig = () => {
  if (typeof window === "undefined") return false
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  return Boolean(apiKey && apiKey !== "" && apiKey !== "undefined")
}

export const isDemoMode = !hasValidConfig()

// Cached instances
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let isInitialized = false

// Lazy initialization - only when actually needed
async function initializeFirebase(): Promise<{ app: FirebaseApp | null; auth: Auth | null }> {
  if (typeof window === "undefined") {
    return { app: null, auth: null }
  }

  if (!hasValidConfig()) {
    return { app: null, auth: null }
  }

  if (isInitialized) {
    return { app: firebaseApp, auth: firebaseAuth }
  }

  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getAuth } = await import("firebase/auth")

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    }

    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    firebaseAuth = getAuth(firebaseApp)
    isInitialized = true

    return { app: firebaseApp, auth: firebaseAuth }
  } catch (error) {
    console.error("Firebase initialization failed:", error)
    return { app: null, auth: null }
  }
}

export async function getFirebaseAuth(): Promise<Auth | null> {
  const { auth } = await initializeFirebase()
  return auth
}

export async function setupRecaptcha(elementId: string): Promise<RecaptchaVerifierType | null> {
  if (typeof window === "undefined" || !hasValidConfig()) return null

  try {
    const auth = await getFirebaseAuth()
    if (!auth) return null

    const { RecaptchaVerifier } = await import("firebase/auth")
    
    const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("[v0] reCAPTCHA solved")
      },
    })
    
    return recaptchaVerifier
  } catch (error) {
    console.error("Error setting up reCAPTCHA:", error)
    return null
  }
}

export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifierType | null
): Promise<ConfirmationResult | null> {
  if (!hasValidConfig()) {
    // Demo mode - return null, handled in login modal
    return null
  }

  try {
    const auth = await getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase not initialized")
    }

    if (!recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized")
    }

    const { signInWithPhoneNumber } = await import("firebase/auth")
    const formattedNumber = `+91${phoneNumber}`
    const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier)
    return confirmationResult
  } catch (error) {
    console.error("Error sending OTP:", error)
    throw error
  }
}

export async function verifyOTP(
  confirmationResult: ConfirmationResult | null,
  otp: string
): Promise<boolean> {
  if (!hasValidConfig()) {
    // Demo mode - accept "1234" as valid OTP (4 digits)
    return otp === "1234"
  }

  try {
    if (!confirmationResult) {
      throw new Error("No confirmation result")
    }
    await confirmationResult.confirm(otp)
    return true
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

export type { ConfirmationResult, RecaptchaVerifierType }
