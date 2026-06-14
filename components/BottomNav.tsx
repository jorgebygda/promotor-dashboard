"use client"

import { usePathname, useRouter } from "next/navigation"

const tabs = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/report", label: "Reporte", icon: "📋" },
  { path: "/competition", label: "Competencia", icon: "🏁" },
  { path: "/history", label: "Historial", icon: "📚" },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active
                  ? "text-brand-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  active ? "text-brand-600" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
