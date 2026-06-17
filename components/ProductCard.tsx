"use client"

interface ProductCardProps {
  name: string
  unit: string
  stockValue: number
  saleValue: number
  onStockChange: (delta: number) => void
  onSaleChange?: (delta: number) => void
  onStockSet: (value: number) => void
  onSaleSet?: (value: number) => void
  hideSales?: boolean
}

export default function ProductCard({
  name,
  unit,
  stockValue,
  saleValue,
  onStockChange,
  onSaleChange,
  onStockSet,
  onSaleSet,
  hideSales,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-card animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">
            {name}
          </h3>
          <span className="text-xs text-slate-400 mt-0.5 block">{unit}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="bg-slate-50/80 rounded-xl px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Stock
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onStockChange(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-red-50 active:border-red-200 active:text-red-500 transition-all text-base font-bold shadow-sm"
              >
                −
              </button>
              <input
                type="number"
                min="0"
                value={stockValue}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  onStockSet(isNaN(v) ? 0 : Math.max(0, v))
                }}
                className="w-14 text-center font-bold text-lg tabular-nums text-slate-800 bg-white rounded-xl border border-slate-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => onStockChange(1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-green-50 active:border-green-200 active:text-green-600 transition-all text-base font-bold shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {!hideSales && (
          <div className="bg-brand-50/50 rounded-xl px-3 py-2 border border-brand-100/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
                Ventas
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSaleChange?.(-1)}
                  disabled={saleValue <= 0}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-orange-50 active:border-orange-200 active:text-orange-500 transition-all text-base font-bold shadow-sm disabled:opacity-30 disabled:active:bg-white"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={saleValue}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    onSaleSet?.(isNaN(v) ? 0 : Math.max(0, v))
                  }}
                  className="w-14 text-center font-bold text-lg tabular-nums text-slate-800 bg-white rounded-xl border border-slate-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => onSaleChange?.(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-green-50 active:border-green-200 active:text-green-600 transition-all text-base font-bold shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
