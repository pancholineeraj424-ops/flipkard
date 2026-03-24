import { Product } from "./cart-context"

export const categories = [
  { id: "electronics", name: "Electronics", icon: "Smartphone" },
  { id: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "home", name: "Home & Furniture", icon: "Home" },
  { id: "appliances", name: "Appliances", icon: "Refrigerator" },
  { id: "beauty", name: "Beauty & Health", icon: "Sparkles" },
  { id: "sports", name: "Sports & Fitness", icon: "Dumbbell" },
  { id: "books", name: "Books & Stationery", icon: "BookOpen" },
  { id: "toys", name: "Toys & Games", icon: "Gamepad2" },
]

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 134999,
    originalPrice: 159999,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.7,
    reviews: 12543,
    description: "Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the powerful A17 Pro chip, titanium design, and the most advanced camera system ever in an iPhone.",
    features: [
      "A17 Pro chip with 6-core GPU",
      "48MP Main camera with 5x optical zoom",
      "Titanium design - lightest Pro Max ever",
      "Action button for quick access",
      "USB-C with USB 3 speeds"
    ],
    inStock: true
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    originalPrice: 149999,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.6,
    reviews: 8932,
    description: "The Samsung Galaxy S24 Ultra brings Galaxy AI to your pocket. With a stunning 6.8-inch display, S Pen included, and a 200MP camera, capture every moment in stunning detail.",
    features: [
      "200MP main camera",
      "Galaxy AI features",
      "S Pen included",
      "Snapdragon 8 Gen 3 processor",
      "5000mAh battery"
    ],
    inStock: true
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    price: 24990,
    originalPrice: 34990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.8,
    reviews: 5621,
    description: "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 8 microphones and advanced audio signal processing.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Multipoint connection",
      "Speak-to-Chat technology",
      "Premium comfort design"
    ],
    inStock: true
  },
  {
    id: "4",
    name: "MacBook Air M3",
    price: 114900,
    originalPrice: 134900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.9,
    reviews: 3245,
    description: "Supercharged by M3. Up to 18 hours of battery life. A stunningly thin design. MacBook Air with M3 is an exceptionally versatile laptop.",
    features: [
      "Apple M3 chip",
      "Up to 18 hours battery",
      "13.6-inch Liquid Retina display",
      "1080p FaceTime HD camera",
      "MagSafe charging"
    ],
    inStock: true
  },
  {
    id: "5",
    name: "Men's Slim Fit Casual Shirt",
    price: 799,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    category: "fashion",
    rating: 4.3,
    reviews: 8756,
    description: "Classic slim fit casual shirt perfect for any occasion. Made from premium cotton for all-day comfort.",
    features: [
      "100% premium cotton",
      "Slim fit design",
      "Button-down collar",
      "Machine washable",
      "Available in multiple colors"
    ],
    inStock: true
  },
  {
    id: "6",
    name: "Women's Ethnic Kurta Set",
    price: 1299,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
    category: "fashion",
    rating: 4.5,
    reviews: 6432,
    description: "Elegant ethnic kurta set with intricate embroidery. Perfect for festivals and special occasions.",
    features: [
      "Premium rayon fabric",
      "Hand embroidered details",
      "Includes kurta and palazzo",
      "Comfortable fit",
      "Traditional design"
    ],
    inStock: true
  },
  {
    id: "7",
    name: "Running Shoes Pro",
    price: 2999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "sports",
    rating: 4.4,
    reviews: 4521,
    description: "High-performance running shoes with advanced cushioning technology for maximum comfort and support.",
    features: [
      "Advanced cushioning",
      "Breathable mesh upper",
      "Durable rubber outsole",
      "Lightweight design",
      "Responsive foam"
    ],
    inStock: true
  },
  {
    id: "8",
    name: "Smart LED TV 55 inch",
    price: 34999,
    originalPrice: 54999,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    category: "electronics",
    rating: 4.5,
    reviews: 7823,
    description: "Immersive 4K UHD display with Dolby Vision and Atmos. Smart features with built-in streaming apps.",
    features: [
      "4K UHD resolution",
      "Dolby Vision & Atmos",
      "Smart TV features",
      "Voice control",
      "Multiple HDMI ports"
    ],
    inStock: true
  },
  {
    id: "9",
    name: "Wooden Dining Table Set",
    price: 24999,
    originalPrice: 39999,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop",
    category: "home",
    rating: 4.6,
    reviews: 1234,
    description: "Elegant solid wood dining table with 6 matching chairs. Perfect for family gatherings.",
    features: [
      "Solid sheesham wood",
      "Seats 6 people",
      "Natural finish",
      "Sturdy construction",
      "Easy assembly"
    ],
    inStock: true
  },
  {
    id: "10",
    name: "Automatic Washing Machine",
    price: 18999,
    originalPrice: 28999,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    category: "appliances",
    rating: 4.4,
    reviews: 5678,
    description: "Fully automatic front load washing machine with inverter technology for efficient cleaning.",
    features: [
      "8kg capacity",
      "Inverter motor",
      "15 wash programs",
      "Steam wash",
      "Quick wash option"
    ],
    inStock: true
  },
  {
    id: "11",
    name: "Skincare Gift Set",
    price: 1499,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    category: "beauty",
    rating: 4.7,
    reviews: 3456,
    description: "Complete skincare routine in a box. Includes cleanser, toner, serum, and moisturizer.",
    features: [
      "Natural ingredients",
      "Suitable for all skin types",
      "Paraben-free",
      "Cruelty-free",
      "Gift packaging"
    ],
    inStock: true
  },
  {
    id: "12",
    name: "Programming Books Bundle",
    price: 899,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    category: "books",
    rating: 4.8,
    reviews: 2134,
    description: "Essential programming books bundle for beginners. Learn Python, JavaScript, and web development.",
    features: [
      "3 books included",
      "Beginner friendly",
      "Practical examples",
      "Updated content",
      "Free online resources"
    ],
    inStock: true
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products
  return products.filter((product) => product.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
  )
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscount(originalPrice: number, price: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
