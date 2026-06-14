'use client';

import { stores } from '@/lib/mock-data';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  Store,
  Loader2,
  Image as ImageIcon,
  Plus,
  FileText,
  SendHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const steps = [
  { num: 1, label: 'Tienda', icon: Store },
  { num: 2, label: 'Fotos', icon: Camera },
  { num: 3, label: 'Enviar', icon: SendHorizontal },
];

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [notes, setNotes] = useState('');

  const handleNext = () => {
    if (step === 1 && !selectedStore) {
      toast.error('Por favor selecciona una tienda');
      return;
    }
    if (step === 2 && !hasPhotos) {
      toast.error('Debes añadir al menos una foto');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('🎉 Reporte enviado correctamente');
      router.push('/');
    }, 1800);
  };

  const selectedStoreName = stores.find((s) => s.id === selectedStore)?.name;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Reporte Rápido</h1>
        <p className="text-slate-500 mt-1 text-sm">Completa los 3 pasos para registrar tu visita</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const done = step > s.num;
          const active = step === s.num;
          return (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm',
                    done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : active
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white border-slate-200 text-slate-400'
                  )}
                >
                  {done ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4.5 w-4.5" size={18} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wide',
                    active ? 'text-indigo-600' : done ? 'text-emerald-600' : 'text-slate-400'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full bg-slate-100">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      step > s.num ? 'bg-emerald-400 w-full' : 'w-0'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Content Card */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {/* Step 1 — Select Store */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">¿En qué tienda estás?</h2>
                <p className="text-sm text-slate-500 mt-0.5">Selecciona el punto de venta actual</p>
              </div>
              <div className="space-y-2.5">
                {stores.map((store) => {
                  const selected = selectedStore === store.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => setSelectedStore(store.id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        selected
                          ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <div
                        className={cn(
                          'p-2.5 rounded-xl shrink-0',
                          selected ? 'bg-indigo-100' : 'bg-slate-100'
                        )}
                      >
                        <Store
                          className={cn('h-5 w-5', selected ? 'text-indigo-600' : 'text-slate-400')}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900">{store.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {store.address}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                          selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        )}
                      >
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Photos */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Añade fotos de la visita</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Captura la exhibición o estado de la góndola
                </p>
              </div>

              {!hasPhotos ? (
                <button
                  onClick={() => setHasPhotos(true)}
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 hover:border-indigo-300 transition-all group"
                >
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Camera className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800">Tomar o subir foto</p>
                    <p className="text-xs text-slate-400 mt-1">Mínimo una imagen requerida</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">
                        Principal
                      </span>
                    </div>
                    <button
                      onClick={() => toast.info('Cámara disponible en app móvil')}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 hover:border-indigo-300 transition-all"
                    >
                      <Plus className="h-5 w-5 text-slate-300" />
                      <span className="text-[9px] font-bold text-slate-300 uppercase">Añadir</span>
                    </button>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> 1 foto añadida correctamente
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Notes & Summary */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Observaciones y envío</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Añade notas opcionales y confirma el reporte
                </p>
              </div>

              {/* Summary box */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Resumen del reporte
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-indigo-500 font-semibold">Tienda</p>
                    <p className="text-sm font-bold text-indigo-900 mt-0.5">{selectedStoreName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-500 font-semibold">Fotos</p>
                    <p className="text-sm font-bold text-indigo-900 mt-0.5">1 imagen adjunta</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-500 font-semibold">Promotor</p>
                    <p className="text-sm font-bold text-indigo-900 mt-0.5">Carlos Ruiz</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-indigo-500 font-semibold">Fecha</p>
                    <p className="text-sm font-bold text-indigo-900 mt-0.5">14 Jun 2026</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Observaciones{' '}
                  <span className="text-slate-400 font-normal normal-case">(opcional)</span>
                </label>
                <Textarea
                  placeholder="Novedades, incidencias, falta de material POP, cambios en el espacio…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 min-h-[120px] border-slate-200 rounded-xl resize-none text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 flex gap-3 border-t border-slate-100 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="border-slate-200 rounded-xl h-11 px-5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Atrás
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 font-semibold"
            >
              Continuar
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
