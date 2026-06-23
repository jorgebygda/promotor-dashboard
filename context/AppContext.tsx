"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { DailyReport, CompetitionReport, StockEntry, SaleEntry } from "@/lib/types"
import { products as localProducts } from "@/lib/mockData"
import { monthlyObjectives } from "@/lib/objectives"
import { supabase } from "@/lib/supabase"

interface AppState {
  products: typeof localProducts
  storeName: string
  dailyReports: DailyReport[]
  competitionReports: CompetitionReport[]
  currentStock: StockEntry[]
  currentSales: SaleEntry[]
  stockEditMode: boolean
  reportDate: string
  savedMessage: string | null
  monthlyObjectives: typeof monthlyObjectives
  totalStoreSales: number
  loading: boolean
}

type Action =
  | { type: "INIT_STATE"; payload: { dailyReports: DailyReport[]; competitionReports: CompetitionReport[]; currentStock: StockEntry[]; totalStoreSales: number } }
  | { type: "SET_REPORT_DATE"; payload: string }
  | { type: "SET_STOCK"; payload: { productId: string; quantity: number } }
  | { type: "SET_SALE"; payload: { productId: string; quantity: number } }
  | { type: "SET_CURRENT_STOCK"; payload: StockEntry[] }
  | { type: "SAVE_DAILY_REPORT"; payload: DailyReport }
  | { type: "SAVE_STOCK_UPDATE" }
  | { type: "SAVE_COMPETITION_REPORT"; payload: CompetitionReport }
  | { type: "CLEAR_SAVED_MESSAGE" }
  | { type: "LOAD_SALES_FROM_REPORT"; payload: DailyReport }
  | { type: "SET_TOTAL_STORE_SALES"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }

const today = new Date().toISOString().split("T")[0]

function buildInitialStock() {
  return localProducts.map((p) => ({ productId: p.id, quantity: 0 }))
}

const initialState: AppState = {
  products: localProducts,
  storeName: "Mi Tienda",
  dailyReports: [],
  competitionReports: [],
  currentStock: buildInitialStock(),
  currentSales: [],
  stockEditMode: false,
  reportDate: today,
  savedMessage: null,
  monthlyObjectives,
  totalStoreSales: 0,
  loading: true,
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT_STATE":
      return { ...state, ...action.payload, loading: false }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_REPORT_DATE":
      return { ...state, reportDate: action.payload }

    case "SET_STOCK": {
      const existing = state.currentStock.findIndex(
        (s) => s.productId === action.payload.productId
      )
      const stock = [...state.currentStock]
      if (existing >= 0) {
        if (action.payload.quantity <= 0) {
          stock.splice(existing, 1)
        } else {
          stock[existing] = action.payload
        }
      } else if (action.payload.quantity > 0) {
        stock.push(action.payload)
      }
      return { ...state, currentStock: stock }
    }

    case "SET_CURRENT_STOCK":
      return { ...state, currentStock: action.payload }

    case "SET_SALE": {
      const existing = state.currentSales.findIndex(
        (s) => s.productId === action.payload.productId
      )
      const sales = [...state.currentSales]
      if (existing >= 0) {
        if (action.payload.quantity <= 0) {
          sales.splice(existing, 1)
        } else {
          sales[existing] = action.payload
        }
      } else if (action.payload.quantity > 0) {
        sales.push(action.payload)
      }
      return { ...state, currentSales: sales }
    }

    case "SAVE_DAILY_REPORT": {
      const existingIdx = state.dailyReports.findIndex(
        (r) => r.date === action.payload.date
      )
      const dailyReports =
        existingIdx >= 0
          ? state.dailyReports.map((r, i) =>
              i === existingIdx ? action.payload : r
            )
          : [action.payload, ...state.dailyReports]
      return {
        ...state,
        dailyReports,
        currentSales: [],
        savedMessage: "Ventas guardadas",
      }
    }

    case "SAVE_STOCK_UPDATE":
      return { ...state, savedMessage: "Stock actualizado" }

    case "SAVE_COMPETITION_REPORT":
      return {
        ...state,
        competitionReports: [action.payload, ...state.competitionReports],
        savedMessage: "Reporte de competencia guardado",
      }

    case "CLEAR_SAVED_MESSAGE":
      return { ...state, savedMessage: null }

    case "LOAD_SALES_FROM_REPORT":
      return {
        ...state,
        reportDate: action.payload.date,
        currentSales: action.payload.sales,
      }

    case "SET_TOTAL_STORE_SALES":
      return { ...state, totalStoreSales: action.payload }

    case "SET_ERROR":
      return { ...state, savedMessage: action.payload }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  saveDailyReport: () => Promise<void>
  saveStockUpdate: () => Promise<void>
  saveCompetitionReport: (report: CompetitionReport) => Promise<void>
  loadSalesFromReport: (report: DailyReport) => void
  setTotalStoreSales: (value: number) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    async function load() {
      try {
        const [stockRes, reportsRes, salesRes, stockSnapRes, compRes, configRes] =
          await Promise.all([
            supabase.from("current_stock").select("*"),
            supabase.from("daily_reports").select("*").order("date", { ascending: false }),
            supabase.from("report_sales").select("*"),
            supabase.from("report_stock").select("*"),
            supabase.from("competition_reports").select("*").order("date", { ascending: false }),
            supabase.from("monthly_config").select("*").eq("month", today.slice(0, 7)).maybeSingle(),
          ])

        const stock: StockEntry[] = stockRes.data?.map((r: any) => ({
          productId: r.product_id,
          quantity: r.quantity,
        })) ?? buildInitialStock()

        const salesMap: Record<string, SaleEntry[]> = {}
        const stockMap: Record<string, StockEntry[]> = {}
        ;(salesRes.data ?? []).forEach((r: any) => {
          if (!salesMap[r.report_id]) salesMap[r.report_id] = []
          salesMap[r.report_id].push({ productId: r.product_id, quantity: r.quantity })
        })
        ;(stockSnapRes.data ?? []).forEach((r: any) => {
          if (!stockMap[r.report_id]) stockMap[r.report_id] = []
          stockMap[r.report_id].push({ productId: r.product_id, quantity: r.quantity })
        })

        const dailyReports: DailyReport[] = (reportsRes.data ?? []).map((r: any) => ({
          id: r.id,
          date: r.date,
          stock: stockMap[r.id] ?? [],
          sales: salesMap[r.id] ?? [],
          completed: r.completed,
          createdAt: r.created_at,
        }))

        const competitionReports: CompetitionReport[] = (compRes.data ?? []).map((r: any) => ({
          id: r.id,
          date: r.date,
          competitorName: r.competitor_name,
          promoters: r.promoters,
          hours: r.hours,
          observations: r.observations ?? "",
          photoUrl: r.photo_url ?? undefined,
        }))

        const totalStoreSales = configRes.data?.total_store_sales ?? 0

        dispatch({
          type: "INIT_STATE",
          payload: { dailyReports, competitionReports, currentStock: stock, totalStoreSales },
        })
      } catch (err) {
        console.error("Error loading data from Supabase:", err)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }
    load()
  }, [])

  const saveDailyReport = useCallback(async () => {
    const date = state.reportDate
    const existingIdx = state.dailyReports.findIndex((r) => r.date === date)
    const reportId = existingIdx >= 0 ? state.dailyReports[existingIdx].id : `r${Date.now()}`

    const activeSales = state.currentSales.filter((s) => s.quantity > 0)
    const stockForReport = activeSales.map((s) => ({
      productId: s.productId,
      quantity: state.currentStock.find((st) => st.productId === s.productId)?.quantity ?? 0,
    }))

    const report: DailyReport = {
      id: reportId,
      date,
      stock: stockForReport,
      sales: activeSales,
      completed: true,
      createdAt: new Date().toISOString(),
    }

    const { error: upsertErr } = await supabase.from("daily_reports").upsert(
      { id: reportId, date, completed: true, created_at: report.createdAt },
      { onConflict: "date" }
    )
    if (upsertErr) { dispatch({ type: "SET_ERROR", payload: "Error al guardar: " + upsertErr.message }); return }

    await supabase.from("report_sales").delete().eq("report_id", reportId)
    if (activeSales.length > 0) {
      const { error } = await supabase.from("report_sales").insert(
        activeSales.map((s) => ({ report_id: reportId, product_id: s.productId, quantity: s.quantity }))
      )
      if (error) { dispatch({ type: "SET_ERROR", payload: "Error al guardar ventas: " + error.message }); return }
    }

    await supabase.from("report_stock").delete().eq("report_id", reportId)
    if (stockForReport.length > 0) {
      const { error } = await supabase.from("report_stock").insert(
        stockForReport.map((s) => ({ report_id: reportId, product_id: s.productId, quantity: s.quantity }))
      )
      if (error) { dispatch({ type: "SET_ERROR", payload: "Error al guardar stock: " + error.message }); return }
    }

    for (const s of activeSales) {
      const { error } = await supabase.from("current_stock").upsert(
        { product_id: s.productId, quantity: state.currentStock.find((st) => st.productId === s.productId)?.quantity ?? 0 },
        { onConflict: "product_id" }
      )
      if (error) { dispatch({ type: "SET_ERROR", payload: "Error al guardar stock: " + error.message }); return }
    }

    dispatch({ type: "SAVE_DAILY_REPORT", payload: report })
  }, [state.reportDate, state.currentSales, state.currentStock, state.dailyReports])

  const saveStockUpdate = useCallback(async () => {
    for (const entry of state.currentStock) {
      const { error } = await supabase.from("current_stock").upsert(
        { product_id: entry.productId, quantity: entry.quantity },
        { onConflict: "product_id" }
      )
      if (error) { dispatch({ type: "SET_ERROR", payload: "Error al guardar stock: " + error.message }); return }
    }
    dispatch({ type: "SAVE_STOCK_UPDATE" })
  }, [state.currentStock])

  const saveCompetitionReport = useCallback(async (report: CompetitionReport) => {
    const { error } = await supabase.from("competition_reports").insert({
      id: report.id,
      date: report.date,
      competitor_name: report.competitorName,
      promoters: report.promoters,
      hours: report.hours,
      observations: report.observations,
      photo_url: report.photoUrl ?? null,
    })
    if (error) { dispatch({ type: "SET_ERROR", payload: "Error al guardar: " + error.message }); return }
    dispatch({ type: "SAVE_COMPETITION_REPORT", payload: report })
  }, [])

  const loadSalesFromReport = useCallback((report: DailyReport) => {
    dispatch({ type: "LOAD_SALES_FROM_REPORT", payload: report })
  }, [])

  const setTotalStoreSales = useCallback(async (value: number) => {
    const month = today.slice(0, 7)
    await supabase.from("monthly_config").upsert(
      { month, total_store_sales: value },
      { onConflict: "month" }
    )
    dispatch({ type: "SET_TOTAL_STORE_SALES", payload: value })
  }, [])

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        saveDailyReport,
        saveStockUpdate,
        saveCompetitionReport,
        loadSalesFromReport,
        setTotalStoreSales,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
