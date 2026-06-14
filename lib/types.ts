export interface Product {
  id: string
  name: string
  unit: string
  category: string
}

export interface StockEntry {
  productId: string
  quantity: number
}

export interface SaleEntry {
  productId: string
  quantity: number
}

export interface DailyReport {
  id: string
  date: string
  stock: StockEntry[]
  sales: SaleEntry[]
  completed: boolean
  createdAt: string
}

export interface CompetitionReport {
  id: string
  date: string
  competitorName: string
  promoters: number
  hours: number
  observations: string
  photoUrl?: string
}

export const COMPETITOR_BRANDS = [
  "Xiaomi",
  "Samsung",
  "Honor",
  "Motorola",
  "Realme",
  "Vivo",
  "Apple",
] as const

export type TabRoute = "/" | "/report" | "/competition" | "/history"
