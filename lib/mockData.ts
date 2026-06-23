import { Product, DailyReport, CompetitionReport } from "./types"

export const storeName = "Mi Tienda"

export const products: Product[] = [
  { id: "p1", name: "Find X9 Ultra 5G", unit: "unidad", category: "Premium" },
  { id: "p2", name: "Find X9 Pro 5G", unit: "unidad", category: "Premium" },
  { id: "p3", name: "Find X9 5G", unit: "unidad", category: "Premium" },
  { id: "p4", name: "Reno 16", unit: "unidad", category: "Premium" },
  { id: "p5", name: "Reno 16FS", unit: "unidad", category: "Premium" },
  { id: "p6", name: "Reno 16F", unit: "unidad", category: "Premium" },
  { id: "p7", name: "RENO 14 512", unit: "unidad", category: "Premium" },
  { id: "p8", name: "RENO 14 256", unit: "unidad", category: "Premium" },
  { id: "p9", name: "Reno 15 FS", unit: "unidad", category: "Premium" },
  { id: "p10", name: "RENO 14 FS", unit: "unidad", category: "Premium" },
  { id: "p11", name: "RENO 14 F 256", unit: "unidad", category: "Premium" },
  { id: "p12", name: "A6 PRO", unit: "unidad", category: "Serie A" },
  { id: "p13", name: "A6 5G", unit: "unidad", category: "Serie A" },
  { id: "p14", name: "A6 4G", unit: "unidad", category: "Serie A" },
  { id: "p15", name: "A 6K", unit: "unidad", category: "Serie A" },
  { id: "p16", name: "A5X 4+128", unit: "unidad", category: "Serie A" },
  { id: "p17", name: "Cargador 45W", unit: "unidad", category: "IoT" },
  { id: "p18", name: "Cargador 80W", unit: "unidad", category: "IoT" },
  { id: "p19", name: "Enco Buds 3 Pro", unit: "unidad", category: "IoT" },
  { id: "p20", name: "Enco Air 4 Pro", unit: "unidad", category: "IoT" },
  { id: "p21", name: "Enco Air 5 Pro", unit: "unidad", category: "IoT" },
  { id: "p22", name: "Enco X3s", unit: "unidad", category: "IoT" },
  { id: "p23", name: "Enco Clip 2", unit: "unidad", category: "IoT" },
  { id: "p24", name: "OPPO Watch X", unit: "unidad", category: "IoT" },
  { id: "p25", name: "Watch X2", unit: "unidad", category: "IoT" },
  { id: "p26", name: "X2 Mini", unit: "unidad", category: "IoT" },
]

export const mockDailyReports: DailyReport[] = [
  {
    id: "r1",
    date: "2026-06-12",
    stock: [
      { productId: "p1", quantity: 5 },
      { productId: "p2", quantity: 3 },
      { productId: "p4", quantity: 8 },
      { productId: "p12", quantity: 10 },
    ],
    sales: [
      { productId: "p1", quantity: 1 },
      { productId: "p4", quantity: 2 },
    ],
    completed: true,
    createdAt: "2026-06-12T10:30:00Z",
  },
  {
    id: "r2",
    date: "2026-06-13",
    stock: [
      { productId: "p1", quantity: 4 },
      { productId: "p9", quantity: 6 },
      { productId: "p13", quantity: 7 },
    ],
    sales: [
      { productId: "p9", quantity: 1 },
      { productId: "p13", quantity: 2 },
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
