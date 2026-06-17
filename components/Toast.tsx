"use client"

import { useEffect } from "react"
import { useApp } from "@/context/AppContext"

export default function Toast() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    if (state.savedMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_SAVED_MESSAGE" })
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [state.savedMessage, dispatch])

  if (!state.savedMessage) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] max-w-lg mx-auto animate-slide-down">
      <div className="bg-slate-900 text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl shadow-black/10 flex items-center gap-3 backdrop-blur-sm">
        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">
          ✓
        </span>
        {state.savedMessage}
      </div>
    </div>
  )
}
