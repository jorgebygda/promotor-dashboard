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
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 w-16">Stock</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStockChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 active:bg-red-100 transition-colors text-lg font-bold"
            >
              -
            </button>
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                onStockSet(isNaN(v) ? 0 : Math.max(0, v))
              }}
              className="w-14 text-center font-bold text-lg tabular-nums bg-gray-50 rounded-lg border border-gray-200 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() => onStockChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 active:bg-green-100 transition-colors text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>

        {!hideSales && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 w-16">
              Ventas
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSaleChange?.(-1)}
                disabled={saleValue <= 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 active:bg-orange-100 transition-colors text-lg font-bold disabled:opacity-30 disabled:active:bg-orange-50"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={saleValue}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  onSaleSet?.(isNaN(v) ? 0 : Math.max(0, v))
                }}
                className="w-14 text-center font-bold text-lg tabular-nums bg-gray-50 rounded-lg border border-gray-200 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => onSaleChange?.(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 active:bg-green-100 transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
