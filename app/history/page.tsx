"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export default function HistoryPage() {
  const { state, dispatch } = useApp()
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
      dispatch({ type: "LOAD_SALES_FROM_REPORT", payload: report })
      router.push("/report")
    }
  }

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
        <p className="text-sm text-gray-500 mt-1">{state.storeName}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("diario")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "diario"
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Ventas
        </button>
        <button
          onClick={() => setActiveTab("competencia")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "competencia"
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Competencia
        </button>
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {activeTab === "diario" ? (
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No hay ventas registradas
            </p>
          ) : (
            filteredReports.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {r.date}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.sales.length} productos ·{" "}
                      {r.sales.reduce((s, e) => s + e.quantity, 0)} ventas
                    </p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Completo
                  </span>
                </div>
                {r.sales.length > 0 && (
                  <div className="text-xs text-gray-500 space-y-0.5 mb-2">
                    {r.sales.map((s) => {
                      const prod = state.products.find(
                        (p) => p.id === s.productId
                      )
                      return (
                        <p key={s.productId}>
                          {prod?.name}: {s.quantity}
                        </p>
                      )
                    })}
                  </div>
                )}
                <button
                  onClick={() => handleLoadReport(r.id)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
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
            <p className="text-sm text-gray-400 text-center py-8">
              No hay reportes de competencia
            </p>
          ) : (
            filteredCompetition.map((r) => (
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
                  <p className="text-xs text-gray-500 mt-1">
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
