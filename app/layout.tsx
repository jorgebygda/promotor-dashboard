import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import BottomNav from "@/components/BottomNav"
import Toast from "@/components/Toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Promotor Dashboard",
  description: "App de reportes para promotores de ventas",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
            <Toast />
            <main>{children}</main>
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
