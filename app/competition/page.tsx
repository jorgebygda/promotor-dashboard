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
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Competencia</h1>
        <p className="text-sm text-gray-500 mt-1">
          {state.storeName} — Registro quincenal
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
              Competidor
            </label>
            <div className="relative">
              <select
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {COMPETITOR_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                Promotores
              </label>
              <input
                type="number"
                value={promoters}
                onChange={(e) => setPromoters(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                Horas
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
              Observaciones
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Modelos, promociones, notas..."
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-300 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>

      {lastReports.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">
            Últimos registros
          </h2>
          <div className="space-y-2">
            {lastReports.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="mb-1">
                  <p className="font-medium text-sm text-gray-900">
                    {r.competitorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.date} · {r.promoters} prom. · {r.hours}h
                  </p>
                </div>
                {r.observations && (
                  <p className="text-xs text-gray-500 mt-1">{r.observations}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
