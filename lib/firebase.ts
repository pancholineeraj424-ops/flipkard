import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

// For development/demo mode when Firebase is not configured
const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY

export { app, auth, isDemoMode }
export type { RecaptchaVerifier, ConfirmationResult }

export async function setupRecaptcha(elementId: string): Promise<RecaptchaVerifier | null> {
  if (isDemoMode) return null
  
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
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
  recaptchaVerifier: RecaptchaVerifier | null
): Promise<ConfirmationResult | null> {
  if (isDemoMode) {
    // Return mock confirmation result for demo
    return null
  }

  try {
    if (!recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized")
    }
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
  if (isDemoMode) {
    // For demo, accept "123456" as valid OTP
    return otp === "123456"
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
