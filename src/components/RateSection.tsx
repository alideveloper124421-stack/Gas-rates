import React from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { formatPKR } from '../utils/numberWords.ts';

interface RateSectionProps {
  baseRate: number;
  setBaseRate: (val: number) => void;
  baseWeight: number;
  setBaseWeight: (val: number) => void;
  perKgRate: number;
  extraPerCylinder: number;
  setExtraPerCylinder: (val: number) => void;
  useCustomPerKgRate: boolean;
  setUseCustomPerKgRate: (val: boolean) => void;
  customPerKgRate: number;
  setCustomPerKgRate: (val: number) => void;
}

export const RateSection: React.FC<RateSectionProps> = ({
  baseRate,
  setBaseRate,
  baseWeight,
  perKgRate,
  extraPerCylinder,
  setExtraPerCylinder,
  useCustomPerKgRate,
  setUseCustomPerKgRate,
  customPerKgRate,
  setCustomPerKgRate,
}) => {
  const handleRateStep = (delta: number) => {
    setBaseRate(Math.max(100, baseRate + delta));
  };

  const effectivePerKg = useCustomPerKgRate ? customPerKgRate : perKgRate;

  return (
    <section id="section-rate" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        {/* Simple Section Header */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">
              مین ریٹ (Main Gas Rate)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setUseCustomPerKgRate(!useCustomPerKgRate);
              if (!useCustomPerKgRate) setCustomPerKgRate(perKgRate);
            }}
            className="text-xs text-slate-500 hover:text-amber-600 font-medium cursor-pointer transition-colors"
          >
            {useCustomPerKgRate ? 'آٹو ریٹ لگائیں' : 'کسٹم کلو ریٹ؟'}
          </button>
        </div>

        {/* 3 Main Rate Fields in a Clean Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Field 1: Base Cylinder Rate */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <label htmlFor="baseRateInput" className="text-xs font-semibold text-slate-700 block mb-1.5">
              11.8 کلو سلنڈر ریٹ (بنیادی ریٹ)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-semibold text-xs">Rs.</span>
              <input
                id="baseRateInput"
                type="number"
                min="100"
                step="50"
                value={baseRate || ''}
                onChange={(e) => setBaseRate(Number(e.target.value) || 0)}
                className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-lg font-bold font-mono tracking-tight focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tabular-nums"
                placeholder="5500"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleRateStep(-100)}
                  className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="-100"
                  aria-label="Decrease rate by 100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRateStep(100)}
                  className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="+100"
                  aria-label="Increase rate by 100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Field 2: 1 KG Calculated Rate (Instant Hero Result) */}
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-900">1 کلو کا ریٹ (خودکار)</span>
              <span className="text-[11px] text-amber-700 font-mono">
                {formatPKR(baseRate)} ÷ {baseWeight}
              </span>
            </div>

            {useCustomPerKgRate ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={customPerKgRate}
                  onChange={(e) => setCustomPerKgRate(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-lg font-bold font-mono text-slate-900 focus:outline-none"
                />
                <span className="text-xs font-bold text-amber-800 shrink-0">روپے/kg</span>
              </div>
            ) : (
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tracking-tight tabular-nums">
                  {effectivePerKg.toFixed(2)}
                </div>
                <span className="text-xs font-bold text-amber-800">
                  روپے فی کلو (Rs/kg)
                </span>
              </div>
            )}
          </div>

          {/* Field 3: Extra Surcharge */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <label htmlFor="extraSurchargeInput" className="text-xs font-semibold text-slate-700 block mb-1.5">
              کمرشل اضافی رقم (35kg & 45.4kg)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-semibold text-xs">Rs.</span>
              <input
                id="extraSurchargeInput"
                type="number"
                min="0"
                step="50"
                value={extraPerCylinder}
                onChange={(e) => setExtraPerCylinder(Number(e.target.value) || 0)}
                className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-lg font-bold font-mono tracking-tight focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tabular-nums"
                placeholder="400"
              />
              <span className="absolute right-3 text-xs text-slate-400 font-medium pointer-events-none">
                روپے فی سلنڈر
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
