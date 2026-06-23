"use client"

import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { CommissionTarget } from "@/lib/types"

function getProductSales(state: ReturnType<typeof useApp>["state"]) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthly = state.dailyReports
    .filter((r) => r.date.startsWith(currentMonth))
  return state.products.map((p) => {
    const total = monthly.reduce(
      (sum, r) => sum + (r.sales.find((s) => s.productId === p.id)?.quantity ?? 0),
      0
    )
    return { product: p, total }
  })
}

export default function Dashboard() {
  const { state, dispatch, setTotalStoreSales, loadSalesFromReport } = useApp()
  const router = useRouter()

  if (state.loading) {
    return (
      <div className="px-4 pt-6 pb-28">
        <div className="flex items-center justify-center h-64">
          <div className="text-sm text-slate-400 animate-pulse">Cargando...</div>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split("T")[0]
  const todayReport = state.dailyReports.find((r) => r.date === today)
  const todayPhoneSales = todayReport
    ? todayReport.sales
        .filter((s) => state.products.find((p) => p.id === s.productId)?.category !== "IoT")
        .reduce((s, e) => s + e.quantity, 0)
    : 0
  const todayTotalSales = todayReport
    ? todayReport.sales.reduce((s, e) => s + e.quantity, 0)
    : 0

  const currentMonth = today.slice(0, 7)
  const allMonthlySales = state.dailyReports
    .filter((r) => r.date.startsWith(currentMonth))
  const monthlySales = allMonthlySales
    .reduce((sum, r) => sum + r.sales
      .filter((s) => state.products.find((p) => p.id === s.productId)?.category !== "IoT")
      .reduce((s, e) => s + e.quantity, 0), 0)

  const productSales = getProductSales(state)

  const totalTarget = state.monthlyObjectives.totalTarget
  const mmPercent = totalTarget > 0 ? Math.round((monthlySales / totalTarget) * 100) : 0
  const mmTier = mmPercent >= 100 ? "100" : mmPercent >= 75 ? "75" : "min"

  const handleEditSales = () => {
    if (todayReport) {
      loadSalesFromReport(todayReport)
    } else {
      dispatch({ type: "SET_REPORT_DATE", payload: today })
    }
    router.push("/report")
  }

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

  const hasStock = Object.keys(stockByCategory).length > 0

  const accessorySales = state.dailyReports
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.sales
      .filter((s) => state.products.find((p) => p.id === s.productId)?.category === "IoT")
      .reduce((s, e) => s + e.quantity, 0), 0)

  const accessoryPct = totalTarget > 0
    ? Math.round((accessorySales / totalTarget) * 100)
    : 0

  const currentIotLevel = [...state.monthlyObjectives.iotLevels]
    .reverse()
    .find((l) => accessoryPct >= l.percentage)

  const ihsPct = state.totalStoreSales > 0
    ? Math.round((monthlySales / state.totalStoreSales) * 100)
    : 0

  const currentIhsLevel = [...state.monthlyObjectives.ihsLevels]
    .reverse()
    .find((l) => ihsPct >= l.percentage)

  const commissionEnabled = mmPercent >= 75

  function estimatedCommission(target: CommissionTarget) {
    if (mmPercent >= 100) return target.commission100
    if (mmPercent >= 75) return target.commission75
    return 0
  }

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
        <button onClick={handleEditSales} className="text-left bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 p-4 shadow-card active:scale-[0.98] transition-transform">
          <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
            <span className="text-brand-600 text-sm font-bold">$</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ventas hoy
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {todayPhoneSales}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {todayTotalSales > todayPhoneSales
              ? `+${todayTotalSales - todayPhoneSales} acc.`
              : todayReport ? "Completado" : "Sin registro"}
          </p>
        </button>

        <button onClick={() => router.push("/stock")} className="text-left bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 p-4 shadow-card active:scale-[0.98] transition-transform">
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
        </button>
      </div>

      <div className="space-y-4 mb-6">

        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 shadow-lg shadow-brand-200 mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">
              MM Smartphone
            </p>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${mmTier === "100" ? "bg-emerald-400 text-emerald-900" : mmTier === "75" ? "bg-amber-400 text-amber-900" : "bg-white/15 text-brand-200"}`}>
              {mmTier === "100" ? "Objetivo cumplido" : mmTier === "75" ? "Mínimo alcanzado" : "Por debajo del mínimo"}
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-0.5">
            {monthlySales}
            <span className="text-lg font-normal text-brand-200">/{totalTarget}</span>
          </p>
          <div className="relative w-full bg-white/15 rounded-full h-2.5 mt-3 mb-1 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, mmPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-brand-200">
            <span>0</span>
            <span className={mmPercent >= 75 ? "text-amber-300 font-bold" : ""}>75%</span>
            <span className={mmPercent >= 100 ? "text-emerald-300 font-bold" : ""}>100%</span>
          </div>
          <p className="text-xs text-brand-200 mt-2">
            {commissionEnabled
              ? `Comisiones habilitadas (${mmPercent}% del objetivo)`
              : `Mínimo del 75% necesario para comisiones (actual: ${mmPercent}%)`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-brand-100 flex items-center justify-center text-xs text-brand-600 font-bold">P</span>
            Pilar — comisiones por modelo
          </h2>
          <div className="space-y-3">
            {state.monthlyObjectives.commissionTargets.map((ct) => {
              const ps = productSales.find((p) => p.product.id === ct.productId)
              const sold = ps?.total ?? 0
              const rate = estimatedCommission(ct)
              const estimated = sold * rate
              return (
                <div key={ct.productId} className="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm text-slate-700 truncate">{ps?.product.name ?? ct.productId}</span>
                    {ct.isPriority && <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">Prioridad</span>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{sold}</span>
                    {commissionEnabled && (
                      <span className="text-xs text-slate-400 tabular-nums">{rate}€/u</span>
                    )}
                    {commissionEnabled && (
                      <span className="text-xs font-semibold text-brand-600 tabular-nums w-16 text-right">{estimated.toLocaleString("es-ES")}€</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 font-bold">IoT</span>
            IoT Accesorios — Diversificación
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Accesorios vendidos
              </label>
              <p className="text-2xl font-bold text-slate-900">{accessorySales}</p>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Objetivo móviles
              </label>
              <p className="text-2xl font-bold text-slate-900">{totalTarget}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 -mt-2 mb-2">
            Los accesorios se registran desde la página de ventas
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, accessoryPct)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mb-3">{accessoryPct}% del objetivo ({accessorySales} / {totalTarget})</p>
          <div className="space-y-1.5">
            {state.monthlyObjectives.iotLevels.map((l) => {
              const achieved = accessoryPct >= l.percentage
              return (
                <div
                  key={l.level}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm ${
                    achieved
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <span>Nivel {l.level}: {l.percentage}%</span>
                  <span className="tabular-nums">{l.bonus}€ {achieved ? "✓" : ""}</span>
                </div>
              )
            })}
          </div>
          {currentIotLevel && (
            <p className="text-sm font-semibold text-indigo-600 mt-3">
              Bonus actual: {currentIotLevel.bonus}€ (Nivel {currentIotLevel.level})
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center text-xs text-amber-600 font-bold">%</span>
            IHS Bonus — Mi Impacto
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Míos vendidos
              </label>
              <p className="text-2xl font-bold text-slate-900">{monthlySales}</p>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total tienda
              </label>
              <input
                type="number"
                min="0"
                value={state.totalStoreSales || ""}
                placeholder="0"
                onChange={(e) =>
                  setTotalStoreSales(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="relative w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ihsPct)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mb-3">{ihsPct}% de cuota de mercado</p>
          <div className="space-y-1.5">
            {state.monthlyObjectives.ihsLevels.map((l) => {
              const achieved = ihsPct >= l.percentage
              return (
                <div
                  key={l.percentage}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm ${
                    achieved
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <span>{">"}{l.percentage}%</span>
                  <span className="tabular-nums">{l.bonus}€ {achieved ? "✓" : ""}</span>
                </div>
              )
            })}
          </div>
          {currentIhsLevel && (
            <p className="text-sm font-semibold text-amber-600 mt-3">
              Bonus actual: {currentIhsLevel.bonus}€ ({">"}{currentIhsLevel.percentage}%)
            </p>
          )}
        </div>
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
