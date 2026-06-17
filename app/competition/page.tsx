"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { CompetitionReport, COMPETITOR_BRANDS } from "@/lib/types"

export default function CompetitionPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()

  const [competitorName, setCompetitorName] = useState<string>(COMPETITOR_BRANDS[0])
  const [promoters, setPromoters] = useState("")
  const [hours, setHours] = useState("")
  const [observations, setObservations] = useState("")

  const canSave = promoters.trim()

  const handleSave = () => {
    if (!canSave) return
    const report: CompetitionReport = {
      id: `c${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      competitorName,
      promoters: parseInt(promoters, 10) || 0,
      hours: parseInt(hours, 10) || 0,
      observations: observations.trim(),
    }
    dispatch({ type: "SAVE_COMPETITION_REPORT", payload: report })
    setPromoters("")
    setHours("")
    setObservations("")
    router.push("/")
  }

  const lastReports = state.competitionReports.slice(0, 3)

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {state.storeName}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Competencia</h1>
        <p className="text-sm text-slate-400 mt-0.5">Registro quincenal</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Competidor
            </label>
            <div className="relative">
              <select
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all shadow-soft"
              >
                {COMPETITOR_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Promotores
              </label>
              <input
                type="number"
                value={promoters}
                onChange={(e) => setPromoters(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all placeholder:text-slate-300 shadow-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Horas
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all placeholder:text-slate-300 shadow-soft"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Observaciones
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Modelos, promociones, notas..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all placeholder:text-slate-300 resize-none shadow-soft"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 active:from-brand-800 active:to-brand-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-brand-200/60 transition-all duration-200 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Guardar
          </button>
        </div>
      </div>

      {lastReports.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center text-xs text-amber-600 font-bold">
              ≡
            </span>
            Últimos registros
          </h2>
          <div className="space-y-2">
            {lastReports.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card"
              >
                <div className="mb-1">
                  <p className="font-medium text-sm text-slate-800">
                    {r.competitorName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {r.date} · {r.promoters} prom. · {r.hours}h
                  </p>
                </div>
                {r.observations && (
                  <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded-lg p-2">
                    {r.observations}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
