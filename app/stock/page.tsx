"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export default function StockPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
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

  const handleSave = () => {
    dispatch({ type: "SAVE_STOCK_UPDATE" })
    router.push("/")
  }

  return (
    <div className="px-4 pt-6 pb-28">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {state.storeName}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Actualizar Stock
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Actualizá cuando llegue mercadería nueva
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 shadow-soft"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredProducts.map((product) => {
          const stock = getStock(product.id)
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card animate-fade-in"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                  {product.name}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  {product.unit}
                </span>
              </div>
              <div className="bg-slate-50/80 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Cantidad
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "SET_STOCK",
                          payload: {
                            productId: product.id,
                            quantity: Math.max(0, stock - 1),
                          },
                        })
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-red-50 active:border-red-200 active:text-red-500 transition-all text-base font-bold shadow-sm"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        dispatch({
                          type: "SET_STOCK",
                          payload: {
                            productId: product.id,
                            quantity: isNaN(v) ? 0 : Math.max(0, v),
                          },
                        })
                      }}
                      className="w-14 text-center font-bold text-lg tabular-nums text-slate-800 bg-white rounded-xl border border-slate-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() =>
                        dispatch({
                          type: "SET_STOCK",
                          payload: {
                            productId: product.id,
                            quantity: stock + 1,
                          },
                        })
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-green-50 active:border-green-200 active:text-green-600 transition-all text-base font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40">
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:from-emerald-800 active:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200/60 transition-all duration-200 text-base"
        >
          Guardar Stock
        </button>
      </div>
    </div>
  )
}
