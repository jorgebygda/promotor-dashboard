import { Product, DailyReport, CompetitionReport } from "./types"

export const storeName = "Mi Tienda"

export const products: Product[] = [
  { id: "p1", name: "OPPO Find X9 Ultra 5G", unit: "unidad", category: "Premium" },
  { id: "p2", name: "OPPO Find X9 Pro 5G", unit: "unidad", category: "Premium" },
  { id: "p3", name: "OPPO Find X9 5G", unit: "unidad", category: "Premium" },
  { id: "p4", name: "OPPO Find X8 Pro 5G", unit: "unidad", category: "Premium" },
  { id: "p5", name: "OPPO Reno15 FS", unit: "unidad", category: "Reno" },
  { id: "p6", name: "OPPO Reno14 5G", unit: "unidad", category: "Reno" },
  { id: "p7", name: "OPPO Reno14 FS 5G", unit: "unidad", category: "Reno" },
  { id: "p8", name: "OPPO Reno14 F 5G", unit: "unidad", category: "Reno" },
  { id: "p9", name: "OPPO A6 Pro 5G", unit: "unidad", category: "Serie A" },
  { id: "p10", name: "OPPO A6 5G", unit: "unidad", category: "Serie A" },
  { id: "p11", name: "OPPO A6", unit: "unidad", category: "Serie A" },
  { id: "p12", name: "OPPO A6k", unit: "unidad", category: "Serie A" },
  { id: "p13", name: "OPPO A5x", unit: "unidad", category: "Serie A" },
]

export const mockDailyReports: DailyReport[] = [
  {
    id: "r1",
    date: "2026-06-12",
    stock: [
      { productId: "p1", quantity: 5 },
      { productId: "p2", quantity: 3 },
      { productId: "p6", quantity: 8 },
      { productId: "p9", quantity: 10 },
    ],
    sales: [
      { productId: "p1", quantity: 1 },
      { productId: "p6", quantity: 2 },
    ],
    completed: true,
    createdAt: "2026-06-12T10:30:00Z",
  },
  {
    id: "r2",
    date: "2026-06-13",
    stock: [
      { productId: "p1", quantity: 4 },
      { productId: "p5", quantity: 6 },
      { productId: "p10", quantity: 7 },
    ],
    sales: [
      { productId: "p5", quantity: 1 },
      { productId: "p10", quantity: 2 },
    ],
    completed: true,
    createdAt: "2026-06-13T09:15:00Z",
  },
  {
    id: "r3",
    date: "2026-06-14",
    stock: [],
    sales: [],
    completed: false,
    createdAt: "2026-06-14T08:00:00Z",
  },
]

export const mockCompetitionReports: CompetitionReport[] = [
  {
    id: "c1",
    date: "2026-06-10",
    competitorName: "Samsung",
    promoters: 3,
    hours: 8,
    observations: "Modelo base, 256GB",
  },
  {
    id: "c2",
    date: "2026-06-08",
    competitorName: "Xiaomi",
    promoters: 2,
    hours: 6,
    observations: "Competencia directa gama media",
  },
]
