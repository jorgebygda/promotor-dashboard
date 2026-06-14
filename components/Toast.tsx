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
      <div className="bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <span className="text-green-400 text-lg">✓</span>
        {state.savedMessage}
      </div>
    </div>
  )
}
