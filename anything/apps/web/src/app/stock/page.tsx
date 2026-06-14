'use client';

import { useState } from 'react';
import { products as initialProducts } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Search, Package, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Product = (typeof initialProducts)[0] & { dirty?: boolean };

function getStatus(stock: number, minStock: number, maxStock: number) {
  if (stock <= minStock) return 'critical';
  if ((stock / maxStock) * 100 <= 40) return 'low';
  return 'ok';
}

const statusConfig = {
  critical: {
    label: 'Crítico',
    barColor: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    topBar: 'bg-red-500',
  },
  low: {
    label: 'Bajo',
    barColor: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
    topBar: 'bg-amber-400',
  },
  ok: {
    label: 'Normal',
    barColor: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    topBar: 'bg-emerald-500',
  },
};

export default function StockPage() {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'ok'>('all');

  const critical = items.filter(
    (p) => getStatus(p.stock, p.minStock, p.maxStock) === 'critical'
  ).length;
  const low = items.filter((p) => getStatus(p.stock, p.minStock, p.maxStock) === 'low').length;
  const ok = items.filter((p) => getStatus(p.stock, p.minStock, p.maxStock) === 'ok').length;

  const filtered = items.filter((p) => {
    const st = getStatus(p.stock, p.minStock, p.maxStock);
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filter === 'all' || st === filter);
  });

  const adjust = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta), dirty: true } : p
      )
    );
  };

  const save = (id: number) => {
    const p = items.find((i) => i.id === id)!;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, dirty: false } : i)));
    if (p.stock <= p.minStock) {
      toast.warning(`⚠️ ${p.name} sigue bajo del mínimo (${p.minStock} uds)`);
    } else {
      toast.success(`✅ "${p.name}" actualizado a ${p.stock} unidades`);
    }
  };

  const filterTabs: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: items.length },
    { key: 'critical', label: 'Crítico', count: critical },
    { key: 'low', label: 'Bajo', count: low },
    { key: 'ok', label: 'Normal', count: ok },
  ];

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Gestión de Stock</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Controla el inventario de tus productos en tiempo real
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm font-semibold text-red-700">{critical} Críticos</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
          <Package className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">{low} Bajos</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-700">{ok} Normales</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, SKU o categoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white border-slate-200 rounded-xl shadow-sm"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                filter === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'ml-1.5 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  filter === tab.key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const st = getStatus(product.stock, product.minStock, product.maxStock);
          const cfg = statusConfig[st];
          const barWidth = Math.min((product.stock / product.maxStock) * 100, 100);

          return (
            <Card
              key={product.id}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-slate-100">
                <div
                  className={cn('h-full transition-all duration-500', cfg.topBar)}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">SKU: {product.sku}</p>
                  </div>
                  <span
                    className={cn(
                      'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg',
                      cfg.badge
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                    {cfg.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-black text-slate-900">{product.stock}</span>
                  <span className="text-sm text-slate-400 font-medium">uds</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400 mb-3">
                  <span>
                    Mín: <strong className="text-slate-600">{product.minStock}</strong>
                  </span>
                  <span>
                    Máx: <strong className="text-slate-600">{product.maxStock}</strong>
                  </span>
                  <span>
                    Precio: <strong className="text-slate-600">${product.price}</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div
                    className={cn('h-2 rounded-full transition-all duration-500', cfg.barColor)}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => adjust(product.id, -5)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold text-slate-800 w-10 text-center">
                      {product.stock}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => adjust(product.id, 5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => save(product.id)}
                    disabled={!product.dirty}
                    className="flex-1 h-9 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    {product.dirty ? 'Guardar' : 'Sin cambios'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-slate-500">No se encontraron productos</p>
          <p className="text-sm mt-1">Prueba con otro filtro o búsqueda</p>
        </div>
      )}
    </div>
  );
}
