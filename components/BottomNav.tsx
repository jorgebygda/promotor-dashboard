"use client"

import { usePathname, useRouter } from "next/navigation"

const tabs = [
  { path: "/", label: "Dashboard", icon: "▦" },
  { path: "/report", label: "Ventas", icon: "⊞" },
  { path: "/competition", label: "Competencia", icon: "⊟" },
  { path: "/history", label: "Historial", icon: "≡" },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative ${
                active ? "-mt-1" : ""
              }`}
            >
              <span
                className={`text-lg leading-none transition-all duration-200 ${
                  active
                    ? "text-brand-600 scale-110"
                    : "text-slate-300"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] mt-0.5 font-semibold tracking-wide transition-all duration-200 ${
                  active ? "text-brand-600" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <span className="absolute -top-0.5 w-6 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
