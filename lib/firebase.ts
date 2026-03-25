import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type ConfirmationResult, 
  type Auth 
} from "firebase/auth"

// Check if Firebase is configured with valid credentials
const hasValidConfig = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "undefined"
)

export const isDemoMode = !hasValidConfig

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Only initialize Firebase if we have valid credentials
let app: FirebaseApp | null = null
let auth: Auth | null = null

// Lazy initialization to prevent server-side errors
function initializeFirebase() {
  if (isDemoMode || typeof window === "undefined") {
    return { app: null, auth: null }
  }
  
  if (!app) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
      auth = getAuth(app)
    } catch (error) {
      console.error("Firebase initialization failed:", error)
      return { app: null, auth: null }
    }
  }
  
  return { app, auth }
}

export function getFirebaseAuth(): Auth | null {
  const { auth } = initializeFirebase()
  return auth
}

export { app, auth }
export { RecaptchaVerifier }
export type { ConfirmationResult }

export async function setupRecaptcha(elementId: string): Promise<RecaptchaVerifier | null> {
  if (isDemoMode) return null
  
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) return null
  
  try {
    const recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, elementId, {
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
    // Return null for demo mode - will be handled in login modal
    return null
  }

  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error("Firebase not initialized")
  }

  try {
    if (!recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized")
    }
    const formattedNumber = `+91${phoneNumber}`
    const confirmationResult = await signInWithPhoneNumber(firebaseAuth, formattedNumber, recaptchaVerifier)
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
