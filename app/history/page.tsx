"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export default function HistoryPage() {
  const { state, dispatch, loadSalesFromReport } = useApp()
  const router = useRouter()
  const [filterDate, setFilterDate] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"diario" | "competencia">(
    "diario"
  )

  const filteredReports = useMemo(() => {
    let reports = state.dailyReports
    if (filterDate) {
      reports = reports.filter((r) => r.date === filterDate)
    }
    return reports.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [state.dailyReports, filterDate])

  const filteredCompetition = useMemo(() => {
    let reports = state.competitionReports
    if (filterDate) {
      reports = reports.filter((r) => r.date === filterDate)
    }
    return reports.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [state.competitionReports, filterDate])

  const handleLoadReport = (reportId: string) => {
    const report = state.dailyReports.find((r) => r.id === reportId)
    if (report) {
      loadSalesFromReport(report)
      router.push("/report")
    }
  }

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-dot" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {state.storeName}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Historial</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-1.5 shadow-soft flex gap-1 mb-5">
        <button
          onClick={() => setActiveTab("diario")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "diario"
              ? "bg-brand-600 text-white shadow-sm shadow-brand-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Ventas
        </button>
        <button
          onClick={() => setActiveTab("competencia")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "competencia"
              ? "bg-brand-600 text-white shadow-sm shadow-brand-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Competencia
        </button>
      </div>

      <div className="mb-5">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all shadow-soft"
        />
      </div>

      {activeTab === "diario" ? (
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">No hay ventas registradas</p>
            </div>
          ) : (
            filteredReports.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card animate-fade-in"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm text-slate-800">
                      {r.date}
                    </p>
                    <p className="text-xs text-slate-400">
                      {r.sales.length} productos ·{" "}
                      {r.sales.reduce((s, e) => s + e.quantity, 0)} ventas
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Completo
                  </span>
                </div>
                {r.sales.length > 0 && (
                  <div className="text-xs text-slate-500 space-y-0.5 mb-2 bg-slate-50 rounded-lg p-2">
                    {r.sales.map((s) => {
                      const prod = state.products.find(
                        (p) => p.id === s.productId
                      )
                      return (
                        <p key={s.productId} className="flex justify-between">
                          <span>{prod?.name}</span>
                          <span className="font-medium text-slate-700">
                            {s.quantity}
                          </span>
                        </p>
                      )
                    })}
                  </div>
                )}
                <button
                  onClick={() => handleLoadReport(r.id)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCompetition.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">
                No hay reportes de competencia
              </p>
            </div>
          ) : (
            filteredCompetition.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card animate-fade-in"
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
            ))
          )}
        </div>
      )}
    </div>
  )
}
