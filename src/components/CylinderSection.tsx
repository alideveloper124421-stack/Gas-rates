import React, { useState } from 'react';
import {
  CylinderItem,
  CalculationResultItem,
} from '../types.ts';
import { Plus, Minus, Trash2, PlusCircle } from 'lucide-react';
import { formatPKR } from '../utils/numberWords.ts';

interface CylinderSectionProps {
  items: CylinderItem[];
  calculatedItems: CalculationResultItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onAddCustomCylinder: (name: string, weightKg: number, hasExtra: boolean) => void;
  onRemoveCustomCylinder: (id: string) => void;
  baseRate: number;
  perKgRate: number;
  extraPerCylinder: number;
}

export const CylinderSection: React.FC<CylinderSectionProps> = ({
  items,
  calculatedItems,
  onUpdateQuantity,
  onAddCustomCylinder,
  onRemoveCustomCylinder,
  baseRate,
  perKgRate,
  extraPerCylinder,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWeight, setCustomWeight] = useState<number>(6);
  const [customHasExtra, setCustomHasExtra] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWeight > 0) {
      const name = customName.trim() || `${customWeight} کلو سلنڈر`;
      onAddCustomCylinder(name, customWeight, customHasExtra);
      setCustomName('');
      setCustomWeight(6);
      setCustomHasExtra(false);
      setShowAddModal(false);
    }
  };

  return (
    <section id="section-cylinders" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        {/* Simple Section Header */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              سلنڈروں کی تعداد (Cylinders Quantity)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>نیا سائز (+ Custom)</span>
          </button>
        </div>

        {/* Cylinder Rows */}
        <div className="space-y-3">
          {calculatedItems.map((calc) => {
            const { item, totalGasWeightKg, subtotal } = calc;
            const isStandard = ['cyl-35', 'cyl-11-8', 'cyl-45-4'].includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-slate-50/70 hover:bg-slate-50 transition-colors rounded-xl p-4 border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* 1. Cylinder Title & Weight */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-800 shrink-0 font-mono font-bold text-sm shadow-2xs">
                    {item.weightKg}
                    <span className="text-[9px] text-slate-400 -mt-1 font-sans">KG</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {item.weightKg} کلو سلنڈر
                      </span>
                      {!isStandard && (
                        <button
                          type="button"
                          onClick={() => onRemoveCustomCylinder(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.isDirectRate ? 'گھریلو (ڈائریکٹ ریٹ)' : 'کمرشل سلنڈر'}
                    </span>
                  </div>
                </div>

                {/* 2. Fast Stepper Quantity Input */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-lg font-bold active:scale-95 shadow-2xs"
                    aria-label={`Decrease ${item.weightKg}kg quantity`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                      onUpdateQuantity(item.id, isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-20 h-10 text-center font-mono text-xl font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 tabular-nums shadow-2xs"
                    placeholder="0"
                  />

                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold active:scale-95 shadow-2xs"
                    aria-label={`Increase ${item.weightKg}kg quantity`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-500 ml-1">عدد</span>
                </div>

                {/* 3. Line Total & Compact Formula */}
                <div className="text-left md:text-right min-w-[200px] border-t md:border-t-0 pt-2 md:pt-0 border-slate-200/60">
                  <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {formatPKR(subtotal)} <span className="text-xs font-normal text-slate-500">روپے</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {item.quantity === 0 ? (
                      '0 سلنڈر'
                    ) : item.isDirectRate ? (
                      `${formatPKR(baseRate)} × ${item.quantity}`
                    ) : (
                      `${totalGasWeightKg} kg × ${perKgRate.toFixed(2)} + ${formatPKR(extraPerCylinder * item.quantity)}`
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              نیا سلنڈر سائز شامل کریں (Custom Size)
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  گیس کا وزن (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  required
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="customHasExtraCheck"
                  checked={customHasExtra}
                  onChange={(e) => setCustomHasExtra(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                />
                <label htmlFor="customHasExtraCheck" className="text-xs text-slate-700 cursor-pointer">
                  {formatPKR(extraPerCylinder)} روپے کمرشل اضافی رقم شامل کریں
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                >
                  شامل کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
