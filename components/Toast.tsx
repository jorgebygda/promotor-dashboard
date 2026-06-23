"use client"

import { useEffect } from "react"
import { useApp } from "@/context/AppContext"

export default function Toast() {
  const { state, dispatch } = useApp()

  const isError = state.savedMessage?.startsWith("Error")
  const duration = isError ? 6000 : 2500

  useEffect(() => {
    if (state.savedMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_SAVED_MESSAGE" })
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [state.savedMessage, dispatch, duration])

  if (!state.savedMessage) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] max-w-lg mx-auto animate-slide-down">
      <div className={`text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl shadow-black/10 flex items-center gap-3 backdrop-blur-sm ${
        isError ? "bg-red-600" : "bg-slate-900"
      }`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
          isError ? "bg-red-400/20 text-red-200" : "bg-green-500/20 text-green-400"
        }`}>
          {isError ? "!" : "✓"}
        </span>
        {state.savedMessage}
      </div>
    </div>
  )
}
