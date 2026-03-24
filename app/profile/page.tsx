"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  User,
  Package,
  MapPin,
  Heart,
  ChevronRight,
  Edit2,
  Plus,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
  Shield,
} from "lucide-react"
import { useAuth, Address } from "@/lib/auth-context"
import { useOrders } from "@/lib/order-context"
import { useWishlist } from "@/lib/wishlist-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, updateUser, addAddress, updateAddress, deleteAddress, setDefaultAddress, logout } = useAuth()
  const { orders } = useOrders()
  const { totalItems: wishlistCount } = useWishlist()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  // Profile edit form
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: ""
  })

  // Address form
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" as "home" | "work" | "other"
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const handleSaveProfile = () => {
    if (!profileForm.name.trim()) {
      toast.error("Name is required")
      return
    }
    updateUser(profileForm)
    setIsEditingProfile(false)
    toast.success("Profile updated successfully")
  }

  const handleAddOrUpdateAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.addressLine1 || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill all required fields")
      return
    }

    if (addressForm.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    if (addressForm.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode")
      return
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm)
      toast.success("Address updated successfully")
    } else {
      addAddress({ ...addressForm, isDefault: !user.addresses?.length })
      toast.success("Address added successfully")
    }

    resetAddressForm()
  }

  const resetAddressForm = () => {
    setShowAddressForm(false)
    setEditingAddress(null)
    setAddressForm({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      type: "home"
    })
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type
    })
    setShowAddressForm(true)
  }

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId)
    toast.success("Address deleted")
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">My Account</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="bg-card border border-border rounded-sm overflow-hidden sticky top-20">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hello,</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm bg-primary/10 text-primary font-medium"
                >
                  <User className="h-4 w-4" />
                  Account Settings
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-muted-foreground hover:bg-muted"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                  {orders.length > 0 && (
                    <span className="ml-auto text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                      {orders.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-muted-foreground hover:bg-muted"
                >
                  <Heart className="h-4 w-4" />
                  My Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-muted-foreground hover:bg-muted"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              </nav>
              <div className="p-2 border-t border-border">
                <button
                  onClick={() => {
                    logout()
                    router.push("/")
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold">Personal Information</h2>
                {!isEditingProfile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-primary"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="p-5">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-[#fb641b] hover:bg-[#e85a19]">
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false)
                          setProfileForm({
                            name: user.name,
                            email: user.email,
                            phone: user.phone
                          })
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold">Manage Addresses</h2>
                <Dialog open={showAddressForm} onOpenChange={(open) => {
                  if (!open) resetAddressForm()
                  else setShowAddressForm(true)
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({
                              ...addressForm,
                              phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                            })}
                            placeholder="10-digit mobile"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Address Line 1 *</Label>
                        <Input
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                          placeholder="House No., Building Name, Street"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Address Line 2 (Optional)</Label>
                        <Input
                          value={addressForm.addressLine2}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                          placeholder="Area, Colony, Landmark"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pincode *</Label>
                          <Input
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({
                              ...addressForm,
                              pincode: e.target.value.replace(/\D/g, "").slice(0, 6)
                            })}
                            placeholder="6-digit pincode"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>State *</Label>
                          <Select
                            value={addressForm.state}
                            onValueChange={(value) => setAddressForm({ ...addressForm, state: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Address Type</Label>
                          <Select
                            value={addressForm.type}
                            onValueChange={(value: "home" | "work" | "other") =>
                              setAddressForm({ ...addressForm, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        onClick={handleAddOrUpdateAddress} 
                        className="w-full bg-[#fb641b] hover:bg-[#e85a19]"
                      >
                        {editingAddress ? "Update Address" : "Save Address"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="p-5">
                {user.addresses?.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No saved addresses</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses?.map((address) => (
                      <div
                        key={address.id}
                        className="border border-border rounded-sm p-4 relative"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded uppercase font-medium">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm">{address.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm mt-1">Phone: {address.phone}</p>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                            className="text-primary h-7"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 h-7"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          {!address.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDefaultAddress(address.id)
                                toast.success("Default address updated")
                              }}
                              className="text-muted-foreground h-7 ml-auto"
                            >
                              Set as Default
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick links (mobile) */}
            <div className="md:hidden bg-card border border-border rounded-sm overflow-hidden">
              <Link
                href="/orders"
                className="flex items-center justify-between px-5 py-4 border-b border-border hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-medium">My Orders</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between px-5 py-4 border-b border-border hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="font-medium">My Wishlist</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin"
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Admin Panel</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
