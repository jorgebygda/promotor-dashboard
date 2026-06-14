'use client';

import { calendarData } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const statusStyles = {
  excellent: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Excelente',
  },
  good: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Bueno',
  },
  average: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    label: 'Regular',
  },
  poor: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-400',
    dot: 'bg-slate-300',
    label: 'Bajo',
  },
};

export default function SalesCalendarPage() {
  // June 2026 starts on Monday (weekday index 0 in Mon-based grid)
  const daysInMonth = 30;
  const firstDayOffset = 0; // Monday = 0

  const totalSales = Object.values(calendarData).reduce((a, d) => a + d.total, 0);
  const activeDays = Object.values(calendarData).filter((d) => d.total > 0).length;
  const bestDay = Object.entries(calendarData).reduce(
    (best, [date, d]) => (d.total > best.total ? { date, total: d.total } : best),
    { date: '', total: 0 }
  );

  const cells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Calendario de Ventas</h1>
          <p className="text-slate-500 mt-1 text-sm">Rendimiento diario de tu zona — Junio 2026</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 text-sm font-bold text-slate-800 min-w-[130px] text-center">
            Junio 2026
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Month KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-100">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total del Mes</p>
              <p className="text-xl font-bold text-slate-900">${totalSales.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Días Activos</p>
              <p className="text-xl font-bold text-slate-900">{activeDays} días</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <BarChart2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Mejor Día</p>
              <p className="text-xl font-bold text-slate-900">${bestDay.total.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {DAYS.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[90px] md:min-h-[120px] bg-slate-50/50 border-r border-b border-slate-100"
                />
              );
            }

            const dateKey = `2026-06-${String(day).padStart(2, '0')}`;
            const data = calendarData[dateKey];
            const isToday = day === 14;
            const hasData = data && data.total > 0;
            const styles = data ? statusStyles[data.status] : statusStyles.poor;

            return (
              <div
                key={day}
                className={cn(
                  'min-h-[90px] md:min-h-[120px] p-2 border-r border-b border-slate-100 flex flex-col transition-all cursor-pointer',
                  hasData ? cn(styles.bg, 'hover:brightness-95') : 'hover:bg-slate-50',
                  isToday && 'ring-2 ring-inset ring-indigo-500'
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold',
                      isToday ? 'bg-indigo-600 text-white' : 'text-slate-500'
                    )}
                  >
                    {day}
                  </span>
                  {hasData && <span className={cn('h-2 w-2 rounded-full', styles.dot)} />}
                </div>

                {/* Sales amount */}
                {hasData && (
                  <div className="mt-auto">
                    <p className={cn('text-xs font-bold leading-tight', styles.text)}>
                      ${(data.total / 1000).toFixed(1)}k
                    </p>
                    <p className="text-[9px] text-slate-400 hidden md:block mt-0.5">
                      {styles.label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {Object.entries(statusStyles).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={cn('h-3 w-3 rounded-full', cfg.dot)} />
            <span className="text-xs font-medium text-slate-600">{cfg.label}</span>
          </div>
        ))}
        <p className="ml-auto text-[11px] text-slate-400">Hoy: Domingo 14 Junio 2026</p>
      </div>
    </div>
  );
}
