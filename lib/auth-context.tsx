"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
  type: "home" | "work" | "other"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (addressId: string, updates: Partial<Address>) => void
  deleteAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: { [key: string]: { password: string; user: User } } = {
  "demo@flipkart.com": {
    password: "demo123",
    user: {
      id: "user_1",
      name: "Demo User",
      email: "demo@flipkart.com",
      phone: "9876543210",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      addresses: [
        {
          id: "addr_1",
          name: "Demo User",
          phone: "9876543210",
          addressLine1: "123, MG Road",
          addressLine2: "Near Central Mall",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
          isDefault: true,
          type: "home"
        }
      ],
      createdAt: "2024-01-15"
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("flipkart_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("flipkart_user")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem("flipkart_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("flipkart_user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const demoUser = demoUsers[email.toLowerCase()]
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user)
      return true
    }
    
    // Allow any email/password for demo purposes
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split("@")[0],
      email: email.toLowerCase(),
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString().split("T")[0]
    }
    setUser(newUser)
    return true
  }

  const loginWithOTP = async (phone: string, otp: string): Promise<boolean> => {
    // Simulate OTP verification - accept any 6-digit OTP for demo
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (otp.length === 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: `User ${phone.slice(-4)}`,
        email: "",
        phone,
        addresses: [],
        createdAt: new Date().toISOString().split("T")[0]
      }
      setUser(newUser)
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      addresses: [],
      createdAt: new Date().toISOString().split("T")[0]
    }
    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const addAddress = (address: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: `addr_${Date.now()}`
      }
      // If this is the first address or marked as default, set it as default
      const updatedAddresses = address.isDefault
        ? user.addresses.map(a => ({ ...a, isDefault: false }))
        : user.addresses
      setUser({
        ...user,
        addresses: [...updatedAddresses, newAddress]
      })
    }
  }

  const updateAddress = (addressId: string, updates: Partial<Address>) => {
    if (user) {
      let updatedAddresses = user.addresses.map(a =>
        a.id === addressId ? { ...a, ...updates } : a
      )
      // If this address is being set as default, unset others
      if (updates.isDefault) {
        updatedAddresses = updatedAddresses.map(a =>
          a.id === addressId ? a : { ...a, isDefault: false }
        )
      }
      setUser({ ...user, addresses: updatedAddresses })
    }
  }

  const deleteAddress = (addressId: string) => {
    if (user) {
      setUser({
        ...user,
        addresses: user.addresses.filter(a => a.id !== addressId)
      })
    }
  }

  const setDefaultAddress = (addressId: string) => {
    if (user) {
      setUser({
        ...user,
        addresses: user.addresses.map(a => ({
          ...a,
          isDefault: a.id === addressId
        }))
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithOTP,
        signup,
        logout,
        updateUser,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
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
