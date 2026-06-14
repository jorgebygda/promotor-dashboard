"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import {
  DailyReport,
  CompetitionReport,
  StockEntry,
  SaleEntry,
} from "@/lib/types"
import {
  products,
  storeName,
  mockDailyReports,
  mockCompetitionReports,
} from "@/lib/mockData"

interface AppState {
  products: typeof products
  storeName: string
  dailyReports: DailyReport[]
  competitionReports: CompetitionReport[]
  currentStock: StockEntry[]
  currentSales: SaleEntry[]
  stockEditMode: boolean
  reportDate: string
  savedMessage: string | null
}

type Action =
  | { type: "SET_REPORT_DATE"; payload: string }
  | { type: "SET_STOCK"; payload: { productId: string; quantity: number } }
  | { type: "SET_SALE"; payload: { productId: string; quantity: number } }
  | { type: "SAVE_DAILY_REPORT" }
  | { type: "SAVE_STOCK_UPDATE" }
  | { type: "SAVE_COMPETITION_REPORT"; payload: CompetitionReport }
  | { type: "CLEAR_SAVED_MESSAGE" }
  | { type: "TOGGLE_STOCK_MODE" }
  | { type: "LOAD_SALES_FROM_REPORT"; payload: DailyReport }
  | { type: "SET_INITIAL_STOCK"; payload: StockEntry[] }

const today = new Date().toISOString().split("T")[0]

function buildInitialStock() {
  return products.map((p) => ({
    productId: p.id,
    quantity: 0,
  }))
}

const initialState: AppState = {
  products,
  storeName,
  dailyReports: mockDailyReports,
  competitionReports: mockCompetitionReports,
  currentStock: buildInitialStock(),
  currentSales: [],
  stockEditMode: false,
  reportDate: today,
  savedMessage: null,
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
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
      const date = state.reportDate
      const existingIdx = state.dailyReports.findIndex(
        (r) => r.date === date
      )
      const stockForReport = state.currentSales
        .filter((s) => s.quantity > 0)
        .map((s) => {
          const stockEntry = state.currentStock.find(
            (st) => st.productId === s.productId
          )
          return {
            productId: s.productId,
            quantity: stockEntry?.quantity ?? 0,
          }
        })
      const updatedReport: DailyReport = {
        id:
          existingIdx >= 0
            ? state.dailyReports[existingIdx].id
            : `r${Date.now()}`,
        date,
        stock: stockForReport,
        sales: state.currentSales.filter((s) => s.quantity > 0),
        completed: true,
        createdAt: new Date().toISOString(),
      }
      const dailyReports =
        existingIdx >= 0
          ? state.dailyReports.map((r, i) =>
              i === existingIdx ? updatedReport : r
            )
          : [updatedReport, ...state.dailyReports]
      return {
        ...state,
        dailyReports,
        currentSales: [],
        savedMessage: "Ventas guardadas",
      }
    }

    case "SAVE_STOCK_UPDATE":
      return {
        ...state,
        savedMessage: "Stock actualizado",
      }

    case "SAVE_COMPETITION_REPORT":
      return {
        ...state,
        competitionReports: [action.payload, ...state.competitionReports],
        savedMessage: "Reporte de competencia guardado",
      }

    case "CLEAR_SAVED_MESSAGE":
      return { ...state, savedMessage: null }

    case "TOGGLE_STOCK_MODE":
      return { ...state, stockEditMode: !state.stockEditMode }

    case "LOAD_SALES_FROM_REPORT":
      return {
        ...state,
        reportDate: action.payload.date,
        currentSales: action.payload.sales,
      }

    case "SET_INITIAL_STOCK":
      return { ...state, currentStock: action.payload }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
