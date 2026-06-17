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
  const totalStock = stockWithData.reduce((s, e) => s + e.quantity, 0)
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
    <div className="px-4 pt-6 pb-28">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            {state.storeName}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Promotor Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 p-4 shadow-card">
          <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
            <span className="text-brand-600 text-sm font-bold">$</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ventas hoy
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {todayReport
              ? todayReport.sales.reduce((s, e) => s + e.quantity, 0)
              : 0}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {todayReport ? "Completado" : "Sin registro"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 p-4 shadow-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
            <span className="text-emerald-600 text-sm font-bold">≡</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Stock actual
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalStock}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {stockWithData.length} modelos
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 shadow-lg shadow-brand-200 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">
              Objetivo mensual
            </p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {monthlySales}
              <span className="text-lg font-normal text-brand-200">
                /{monthlyGoal}
              </span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white text-lg font-bold">
            {progressPct}%
          </div>
        </div>
        <div className="w-full bg-white/15 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-brand-200 mt-2">
          {monthlySales} unidades vendidas este mes
        </p>
      </div>

      <button
        onClick={handleEditSales}
        className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 active:from-brand-800 active:to-brand-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-brand-200/60 transition-all duration-200 text-base mb-2.5"
      >
        {todayReport ? "Editar ventas de hoy" : "Registrar ventas"}
      </button>

      <button
        onClick={() => router.push("/stock")}
        className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium py-3.5 px-6 rounded-2xl border border-slate-200 shadow-soft transition-all duration-200 text-sm mb-6"
      >
        Actualizar stock
      </button>

      {hasStock && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-xs text-emerald-600 font-bold">
              ≡
            </span>
            Stock disponible
          </h2>
          <div className="space-y-4">
            {Object.entries(stockByCategory).map(([category, items]) => (
              <div key={category}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {category}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm text-slate-700">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
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
