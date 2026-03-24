import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { OrdersProvider } from '@/lib/orders-context'
import { ReviewsProvider } from '@/lib/reviews-context'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Flipkard — Online Shopping India',
  description: 'Shop electronics, fashion, home, appliances and more at best prices',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>
                <ReviewsProvider>
                  <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-[#172337] text-white py-10">
            <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="font-medium mb-3 text-gray-400 uppercase text-xs tracking-wider">About</h4>
                <ul className="flex flex-col gap-2 text-gray-300">
                  <li className="hover:underline cursor-pointer">Contact Us</li>
                  <li className="hover:underline cursor-pointer">About Us</li>
                  <li className="hover:underline cursor-pointer">Careers</li>
                  <li className="hover:underline cursor-pointer">Flipkard Stories</li>
                  <li className="hover:underline cursor-pointer">Press</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-400 uppercase text-xs tracking-wider">Help</h4>
                <ul className="flex flex-col gap-2 text-gray-300">
                  <li className="hover:underline cursor-pointer">Payments</li>
                  <li className="hover:underline cursor-pointer">Shipping</li>
                  <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
                  <li className="hover:underline cursor-pointer">FAQ</li>
                  <li className="hover:underline cursor-pointer">Report Infringement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-400 uppercase text-xs tracking-wider">Policy</h4>
                <ul className="flex flex-col gap-2 text-gray-300">
                  <li className="hover:underline cursor-pointer">Return Policy</li>
                  <li className="hover:underline cursor-pointer">Terms Of Use</li>
                  <li className="hover:underline cursor-pointer">Security</li>
                  <li className="hover:underline cursor-pointer">Privacy</li>
                  <li className="hover:underline cursor-pointer">Sitemap</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-400 uppercase text-xs tracking-wider">Social</h4>
                <ul className="flex flex-col gap-2 text-gray-300">
                  <li className="hover:underline cursor-pointer">Facebook</li>
                  <li className="hover:underline cursor-pointer">Twitter</li>
                  <li className="hover:underline cursor-pointer">YouTube</li>
                  <li className="hover:underline cursor-pointer">Instagram</li>
                </ul>
              </div>
            </div>
            <div className="max-w-[1400px] mx-auto px-4 mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-gray-400 text-xs">
                <span>Become a Seller</span>
                <span>Advertise</span>
                <span>Gift Cards</span>
                <span>Help Center</span>
              </div>
              <div className="text-gray-500 text-xs">
                © 2007-2026 Flipkard.com
              </div>
            </div>
          </footer>
                  <Toaster />
                </ReviewsProvider>
              </OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
