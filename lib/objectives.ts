import { MonthlyObjectives } from "./types"

export const monthlyObjectives: MonthlyObjectives = {
  totalTarget: 130,
  accessoryTarget: 100,
  commissionTargets: [
    { productId: "p1", targetUnits: 5, commission75: 50, commission100: 100, isPriority: false },
    { productId: "p2", targetUnits: 8, commission75: 30, commission100: 40, isPriority: false },
    { productId: "p3", targetUnits: 10, commission75: 30, commission100: 40, isPriority: false },
    { productId: "p4", targetUnits: 6, commission75: 20, commission100: 40, isPriority: true },
    { productId: "p5", targetUnits: 12, commission75: 15, commission100: 30, isPriority: true },
    { productId: "p6", targetUnits: 10, commission75: 10, commission100: 20, isPriority: true },
    { productId: "p7", targetUnits: 8, commission75: 7, commission100: 14, isPriority: false },
    { productId: "p8", targetUnits: 10, commission75: 6, commission100: 10, isPriority: false },
    { productId: "p9", targetUnits: 15, commission75: 6, commission100: 14, isPriority: false },
    { productId: "p10", targetUnits: 12, commission75: 3, commission100: 6, isPriority: false },
    { productId: "p11", targetUnits: 10, commission75: 4, commission100: 8, isPriority: false },
    { productId: "p12", targetUnits: 15, commission75: 3, commission100: 6, isPriority: false },
    { productId: "p13", targetUnits: 15, commission75: 3, commission100: 5, isPriority: false },

  ],
  iotLevels: [
    { level: 1, percentage: 49, bonus: 100 },
    { level: 2, percentage: 52, bonus: 175 },
    { level: 3, percentage: 55, bonus: 250 },
  ],
  ihsLevels: [
    { percentage: 15, bonus: 100 },
    { percentage: 20, bonus: 200 },
    { percentage: 25, bonus: 300 },
  ],
}
