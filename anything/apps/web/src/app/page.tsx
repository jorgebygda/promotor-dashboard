'use client';

import { kpis, salesHistory, products, recentActivity } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

export default function DashboardPage() {
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const progressPct = Math.min((kpis.dailySales / kpis.dailyTarget) * 100, 100);

  const kpiCards = [
    {
      label: 'Ventas del Día',
      value: `$${kpis.dailySales.toLocaleString()}`,
      sub: `Meta: $${kpis.dailyTarget.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      trend: `+${kpis.salesGrowth}%`,
      trendGood: true,
    },
    {
      label: 'Cumplimiento',
      value: `${kpis.fulfillment}%`,
      sub: 'De la meta diaria',
      icon: Target,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      trend: `${progressPct.toFixed(0)}% logrado`,
      trendGood: progressPct >= 70,
    },
    {
      label: 'Visitas Realizadas',
      value: `${kpis.visitsDone}/${kpis.visitsTarget}`,
      sub: `${kpis.visitsTarget - kpis.visitsDone} pendientes`,
      icon: Users,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      trend: `${Math.round((kpis.visitsDone / kpis.visitsTarget) * 100)}% completado`,
      trendGood: kpis.visitsDone / kpis.visitsTarget >= 0.5,
    },
    {
      label: 'Alertas de Stock',
      value: `${lowStock.length}`,
      sub: 'Productos bajo mínimo',
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: lowStock.length > 0 ? 'Requiere atención' : 'Todo en orden',
      trendGood: lowStock.length === 0,
    },
  ];

  const statusDot: Record<string, string> = {
    success: 'bg-emerald-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hola, Carlos 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Domingo 14 Junio 2026 &mdash; Aquí está tu resumen del día
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm w-fit">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-700">Jornada activa</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                    <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      kpi.trendGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {kpi.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress bar */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-800">Progreso hacia la meta</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">{progressPct.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">
              ${kpis.dailySales.toLocaleString()} vendidos
            </span>
            <span className="text-xs text-slate-500">
              Meta: ${kpis.dailyTarget.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">
                Ventas vs Meta — Hoy
              </CardTitle>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-xs font-medium">
                En vivo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
                      fontSize: '12px',
                    }}
                    formatter={(val: number, name: string) => [
                      `$${val.toLocaleString()}`,
                      name === 'sales' ? 'Ventas' : 'Meta',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="url(#gradTarget)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#gradSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-5 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-500">Ventas reales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">Meta esperada</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts + Activity */}
        <div className="flex flex-col gap-4">
          {/* Low Stock */}
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-800">Bajo Stock</CardTitle>
                {lowStock.length > 0 && (
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
                    {lowStock.length} alertas
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              {lowStock.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 border border-red-100"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-red-500">
                      {p.stock} uds / mín {p.minStock}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                href="/stock"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-2 transition-colors"
              >
                Ver inventario <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${statusDot[act.status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{act.store}</p>
                    <p className="text-xs text-slate-400">{act.action}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3 text-slate-300" />
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
              <Link
                href="/report"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-2 transition-colors"
              >
                Crear reporte <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
