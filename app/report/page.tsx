"use client"

import { Suspense, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp } from "@/context/AppContext"
import ProductCard from "@/components/ProductCard"

function ReportContent() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  const stockMode = searchParams.get("mode") === "stock"

  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")

  const categories = useMemo(() => {
    const cats = Array.from(new Set(state.products.map((p) => p.category)))
    return ["Todas", ...cats]
  }, [state.products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todas") return state.products
    return state.products.filter((p) => p.category === selectedCategory)
  }, [state.products, selectedCategory])

  const getStock = (productId: string) =>
    state.currentStock.find((s) => s.productId === productId)?.quantity ?? 0

  const getSales = (productId: string) =>
    state.currentSales.find((s) => s.productId === productId)?.quantity ?? 0

  const handleStockChange = (productId: string, delta: number) => {
    const current = getStock(productId)
    dispatch({
      type: "SET_STOCK",
      payload: { productId, quantity: Math.max(0, current + delta) },
    })
  }

  const handleStockSet = (productId: string, value: number) => {
    dispatch({
      type: "SET_STOCK",
      payload: { productId, quantity: value },
    })
  }

  const handleSaleChange = (productId: string, delta: number) => {
    const current = getSales(productId)
    const newSale = Math.max(0, current + delta)
    dispatch({
      type: "SET_SALE",
      payload: { productId, quantity: newSale },
    })
    const diff = newSale - current
    if (diff !== 0) {
      const stock = getStock(productId)
      dispatch({
        type: "SET_STOCK",
        payload: {
          productId,
          quantity: Math.max(0, stock - diff),
        },
      })
    }
  }

  const handleSaleSet = (productId: string, value: number) => {
    const prev = getSales(productId)
    const diff = value - prev
    dispatch({
      type: "SET_SALE",
      payload: { productId, quantity: value },
    })
    if (diff > 0) {
      const stock = getStock(productId)
      dispatch({
        type: "SET_STOCK",
        payload: {
          productId,
          quantity: Math.max(0, stock - diff),
        },
      })
    }
  }

  const handleSave = () => {
    if (stockMode) {
      dispatch({ type: "SAVE_STOCK_UPDATE" })
    } else {
      dispatch({ type: "SAVE_DAILY_REPORT" })
    }
    router.push("/")
  }

  const hasSales = state.currentSales.some((s) => s.quantity > 0)
  const canSave = stockMode || hasSales

  return (
    <div className="px-4 pt-6 pb-28">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full animate-pulse-dot ${
              stockMode ? "bg-amber-400" : "bg-brand-400"
            }`}
          />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {state.storeName}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {stockMode ? "Actualizar Stock" : "Registrar Ventas"}
        </h1>
        {!stockMode && (
          <p className="text-xs text-slate-400 mt-1">
            Stock de referencia — usá &quot;Actualizar stock&quot; desde el
            Dashboard cuando llegue mercadería
          </p>
        )}
      </div>

      {!stockMode && (
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Fecha
          </label>
          <input
            type="date"
            value={state.reportDate}
            onChange={(e) =>
              dispatch({ type: "SET_REPORT_DATE", payload: e.target.value })
            }
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all shadow-soft"
          />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-brand-600 text-white shadow-md shadow-brand-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 shadow-soft"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            unit={product.unit}
            stockValue={getStock(product.id)}
            saleValue={getSales(product.id)}
            hideSales={stockMode}
            onStockChange={(delta) => handleStockChange(product.id, delta)}
            onSaleChange={(delta) => handleSaleChange(product.id, delta)}
            onStockSet={(value) => handleStockSet(product.id, value)}
            onSaleSet={(value) => handleSaleSet(product.id, value)}
          />
        ))}
      </div>

      <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 active:from-brand-800 active:to-brand-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-brand-200/60 transition-all duration-200 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {stockMode ? "Guardar Stock" : "Guardar Ventas"}
        </button>
      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 pt-6 text-sm text-slate-400">Cargando...</div>
      }
    >
      <ReportContent />
    </Suspense>
  )
}
