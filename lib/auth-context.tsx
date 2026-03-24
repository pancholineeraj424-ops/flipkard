"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Product } from "./cart-context"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  isAdmin?: boolean
}

export interface Address {
  id: string
  name: string
  phone: string
  pincode: string
  locality: string
  address: string
  city: string
  state: string
  landmark?: string
  type: "home" | "work"
  isDefault: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithOTP: (phone: string, otp: string) => Promise<boolean>
  signup: (data: SignupData) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

interface SignupData {
  name: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: (User & { password: string })[] = [
  {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
    addresses: [
      {
        id: "addr-1",
        name: "Rahul Sharma",
        phone: "9876543210",
        pincode: "110001",
        locality: "Connaught Place",
        address: "123, Block A, Inner Circle",
        city: "New Delhi",
        state: "Delhi",
        type: "home",
        isDefault: true
      }
    ]
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@flipkard.com",
    phone: "9999999999",
    password: "admin123",
    isAdmin: true,
    addresses: []
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("flipkard_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser
      setUser(userData)
      localStorage.setItem("flipkard_user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const loginWithOTP = async (phone: string, otp: string): Promise<boolean> => {
    // Simulate API call - any 6-digit OTP works for demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (otp.length === 6) {
      const foundUser = demoUsers.find(u => u.phone === phone)
      if (foundUser) {
        const { password: _, ...userData } = foundUser
        setUser(userData)
        localStorage.setItem("flipkard_user", JSON.stringify(userData))
        return true
      }
      // Create new user for new phone
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: "New User",
        email: "",
        phone,
        addresses: []
      }
      setUser(newUser)
      localStorage.setItem("flipkard_user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const signup = async (data: SignupData): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      addresses: []
    }
    setUser(newUser)
    localStorage.setItem("flipkard_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("flipkard_user")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("flipkard_user", JSON.stringify(updatedUser))
    }
  }

  const addAddress = (address: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`
      }
      if (address.isDefault) {
        user.addresses.forEach(a => a.isDefault = false)
      }
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress]
      }
      setUser(updatedUser)
      localStorage.setItem("flipkard_user", JSON.stringify(updatedUser))
    }
  }

  const updateAddress = (id: string, address: Partial<Address>) => {
    if (user) {
      const updatedAddresses = user.addresses.map(a => 
        a.id === id ? { ...a, ...address } : a
      )
      const updatedUser = { ...user, addresses: updatedAddresses }
      setUser(updatedUser)
      localStorage.setItem("flipkard_user", JSON.stringify(updatedUser))
    }
  }

  const deleteAddress = (id: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: user.addresses.filter(a => a.id !== id)
      }
      setUser(updatedUser)
      localStorage.setItem("flipkard_user", JSON.stringify(updatedUser))
    }
  }

  const setDefaultAddress = (id: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
      const updatedUser = { ...user, addresses: updatedAddresses }
      setUser(updatedUser)
      localStorage.setItem("flipkard_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
