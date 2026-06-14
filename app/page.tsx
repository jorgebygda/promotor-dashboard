"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]
  const todayReport = state.dailyReports.find((r) => r.date === today)

  const monthlyGoal = 130
  const currentMonth = today.slice(0, 7)
  const monthlySales = state.dailyReports
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.sales.reduce((s, e) => s + e.quantity, 0), 0)
  const progressPct = Math.min(
    100,
    Math.round((monthlySales / monthlyGoal) * 100)
  )

  const stockWithData = state.currentStock.filter((s) => s.quantity > 0)
  const stockByCategory = state.products
    .filter((p) => stockWithData.some((s) => s.productId === p.id))
    .map((p) => ({
      ...p,
      stock: stockWithData.find((s) => s.productId === p.id)?.quantity ?? 0,
    }))
    .reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {} as Record<string, { name: string; stock: number }[]>)

  const handleEditSales = () => {
    if (todayReport) {
      dispatch({ type: "LOAD_SALES_FROM_REPORT", payload: todayReport })
    }
    dispatch({ type: "SET_REPORT_DATE", payload: today })
    router.push("/report")
  }

  const hasStock = Object.keys(stockByCategory).length > 0

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promotor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{state.storeName}</p>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Ventas hoy
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {todayReport
              ? todayReport.sales.reduce((s, e) => s + e.quantity, 0)
              : 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {todayReport ? "Completo" : "Pendiente"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Stock actual
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {state.currentStock.reduce((s, e) => s + e.quantity, 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {state.currentStock.filter((s) => s.quantity > 0).length} modelos
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-900">Objetivo mensual</h2>
          <span className="text-sm font-bold text-brand-600">
            {monthlySales}/{monthlyGoal}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {progressPct}% completado · {monthlySales} unidades
        </p>
      </div>

      <button
        onClick={handleEditSales}
        className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all text-lg mb-3"
      >
        {todayReport ? "Editar ventas de hoy" : "+ Registrar ventas"}
      </button>

      <button
        onClick={() => router.push("/report?mode=stock")}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border border-gray-200 transition-all text-lg mb-6"
      >
        Actualizar stock
      </button>

      {hasStock && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">
            Stock disponible
          </h2>
          <div className="space-y-3">
            {Object.entries(stockByCategory).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                  {category}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm text-gray-700">
                        {item.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
