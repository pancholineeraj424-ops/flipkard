"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  phoneNumber: string
  uid: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "flipkard_auth_user"

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeUser(user: User | null): void {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore localStorage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for persisted session
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)

    // Dynamic import for Firebase to avoid SSR issues
    const setupFirebaseAuth = async () => {
      try {
        const { getFirebaseAuth, isDemoMode } = await import("./firebase")
        
        if (isDemoMode) return

        const auth = getFirebaseAuth()
        if (!auth) return

        const { onAuthStateChanged } = await import("firebase/auth")
        
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser && firebaseUser.phoneNumber) {
            const newUser: User = {
              phoneNumber: firebaseUser.phoneNumber.replace("+91", ""),
              uid: firebaseUser.uid,
            }
            setUser(newUser)
            storeUser(newUser)
          }
        })
      } catch (error) {
        console.error("Firebase auth setup error:", error)
      }
    }

    setupFirebaseAuth()
  }, [])

  const login = (phoneNumber: string) => {
    const newUser: User = {
      phoneNumber,
      uid: `user_${Date.now()}`,
    }
    setUser(newUser)
    storeUser(newUser)
  }

  const logout = async () => {
    try {
      const { getFirebaseAuth, isDemoMode } = await import("./firebase")
      if (!isDemoMode) {
        const auth = getFirebaseAuth()
        if (auth) {
          const { signOut } = await import("firebase/auth")
          await signOut(auth)
        }
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
    setUser(null)
    storeUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
