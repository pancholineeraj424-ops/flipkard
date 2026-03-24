import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

const dealCards = [
  {
    id: 1,
    image: "/deal-phone.jpg",
    brand: "Pulse 2",
    subtitle: "6000 mAh | 50 MP AI dual cam",
    offer: "From ₹6,999",
    badge: null,
  },
  {
    id: 2,
    image: "/deal-luggage.jpg",
    brand: "safari",
    subtitle: "Shades ahead\nBold style, every journey",
    offer: "Up to 80% Off",
    badge: null,
  },
  {
    id: 3,
    image: "/deal-speaker.jpg",
    brand: "MIVI",
    subtitle: "Immersive sound,\nevery single time",
    offer: "Explore now",
    badge: null,
  },
  {
    id: 4,
    image: "/deal-dates.jpg",
    brand: "Happilo",
    subtitle: "Start your Iftar with\nour finest dates",
    offer: "Up to 50% Off",
    badge: null,
  },
  {
    id: 5,
    image: "/deal-ac.jpg",
    brand: "VOLTAS",
    subtitle: "Cooling & Comfort\nPerfectly made for India",
    offer: "Up to 50% Off",
    badge: "INVERTER",
  },
]

export default function HomePage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 py-3 flex flex-col gap-3">

        {/* Main Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Left large banner - Washing Machines */}
          <div className="lg:col-span-5 relative rounded-sm overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 min-h-[220px] md:min-h-[280px]">
            <Image
              src="/banner-washing.jpg"
              alt="Washing Machines Sale"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="bg-white/90 rounded-sm px-3 py-1.5 flex items-center gap-2 w-fit">
                <span className="text-[#ff6b6b] font-bold text-xs">kotak</span>
                <span className="text-xs text-gray-600">10% Instant Discount on Credit Card Transactions*</span>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="text-white/90 text-xs font-medium">realme TechLife</div>
              <div className="text-white font-bold text-xl mt-2">Washing machines</div>
              <div className="text-white font-bold text-2xl">From ₹7,290*</div>
              <div className="text-white/80 text-sm">Semi & fully automatic range</div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">FESTIVALS OF</div>
              <div className="bg-orange-500 text-white text-lg font-bold px-2 py-0.5">INDIA</div>
            </div>
          </div>

          {/* Center banner - Fashion */}
          <div className="lg:col-span-4 relative rounded-sm overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 min-h-[220px] md:min-h-[280px]">
            <Image
              src="/banner-fashion.jpg"
              alt="Spring Summer Fashion"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="bg-white/90 rounded-sm px-3 py-1.5 flex items-center gap-2 w-fit">
                <span className="text-[#ff6b6b] font-bold text-xs">kotak</span>
                <span className="text-xs text-gray-600">10% Instant Discount on Credit Card & EMI Transactions</span>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="bg-pink-200 text-pink-700 text-xs font-bold px-2 py-1 rounded inline-block">FESTIVALS OF</div>
              <div className="bg-pink-600 text-white text-sm font-bold px-2 py-0.5 inline-block">INDIA</div>
              <div className="text-white font-bold text-2xl mt-3">Hello,</div>
              <div className="text-white font-bold text-3xl">Spring Summer '26</div>
              <div className="text-white/90 text-sm mt-1">Discover new season looks</div>
            </div>
          </div>

          {/* Right banner - Phone */}
          <div className="lg:col-span-3 relative rounded-sm overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200 min-h-[220px] md:min-h-[280px]">
            <Image
              src="/banner-phone.jpg"
              alt="Realme P4 Lite 5G"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4">
              <div className="text-gray-700 font-medium text-sm">realme | <span className="text-[#2874f0]">Flipkart</span></div>
              <div className="text-gray-700 text-xs">First-Sale</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-gray-800 font-bold text-xl">P4 Lite 5G</div>
              <div className="text-gray-700 font-semibold">Launching today, 12</div>
              <div className="text-gray-600 text-sm">Segment's only 7000 mAh |</div>
            </div>
          </div>
        </section>

        {/* Deal Cards Row */}
        <section className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center overflow-x-auto">
            {dealCards.map((deal, index) => (
              <Link
                key={deal.id}
                href="/products"
                className={`flex-shrink-0 w-[200px] p-4 hover:shadow-md transition-shadow ${
                  index !== dealCards.length - 1 ? "border-r border-gray-100" : ""
                }`}
              >
                <div className="relative h-[120px] mb-3">
                  <Image
                    src={deal.image}
                    alt={deal.brand}
                    fill
                    className="object-contain"
                  />
                  {deal.badge && (
                    <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5">
                      {deal.badge}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-gray-800">{deal.brand}</div>
                  <div className="text-xs text-gray-500 whitespace-pre-line leading-tight mt-1">
                    {deal.subtitle}
                  </div>
                  <div className="text-green-600 font-semibold text-sm mt-2">{deal.offer}</div>
                </div>
              </Link>
            ))}
            {/* Navigation arrow */}
            <button className="flex-shrink-0 w-10 h-[180px] flex items-center justify-center bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.1)] hover:bg-gray-50">
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Best Deals on Electronics</h2>
            <Link 
              href="/products?category=electronics" 
              className="bg-[#2874f0] text-white text-sm font-medium px-4 py-1.5 rounded-sm hover:bg-[#1a5ec7] transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.slice(0, 6).map((product, index) => (
              <div 
                key={product.id} 
                className={`border-b border-gray-100 ${index % 6 !== 5 ? "border-r" : ""} ${index < 6 ? "" : "border-t-0"}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Fashion Section */}
        <section className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Top Offers on Fashion</h2>
            <Link 
              href="/products?category=fashion" 
              className="bg-[#2874f0] text-white text-sm font-medium px-4 py-1.5 rounded-sm hover:bg-[#1a5ec7] transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.slice(6, 12).map((product, index) => (
              <div 
                key={product.id} 
                className={`border-b border-gray-100 ${index % 6 !== 5 ? "border-r" : ""}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* All Products */}
        <section className="bg-white rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Recently Viewed & More</h2>
            <Link 
              href="/products" 
              className="bg-[#2874f0] text-white text-sm font-medium px-4 py-1.5 rounded-sm hover:bg-[#1a5ec7] transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className={`border-b border-gray-100 ${index % 6 !== 5 ? "border-r" : ""}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
