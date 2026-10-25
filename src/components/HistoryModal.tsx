import React, { useState } from 'react';
import { SavedBill } from '../types.ts';
import { X, Trash2, Calendar, User, Search, RefreshCw, FileText } from 'lucide-react';
import { formatPKR } from '../utils/numberWords.ts';

interface HistoryModalProps {
  savedBills: SavedBill[];
  onLoadBill: (bill: SavedBill) => void;
  onDeleteBill: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  savedBills,
  onLoadBill,
  onDeleteBill,
  onClearAll,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedBills.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      (b.customerName && b.customerName.toLowerCase().includes(term)) ||
      (b.customerPhone && b.customerPhone.includes(term)) ||
      b.dateStr.includes(term) ||
      b.grandTotal.toString().includes(term)
    );
  });

  const totalRevenue = savedBills.reduce((acc, b) => acc + b.grandTotal, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold">سابقہ محفوظ شدہ بل (Saved Offline Bills)</h2>
              <p className="text-[11px] text-slate-400">تمام بل آپ کے براؤزر میں آف لائن محفوظ رہتے ہیں</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Close history modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Stats Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="گاہک کے نام یا فون سے تلاش کریں..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              کل بل: <strong className="text-slate-900">{savedBills.length}</strong>
            </span>
            <span className="text-slate-500">
              کل فروخت: <strong className="text-amber-700 font-mono">{formatPKR(totalRevenue)} روپے</strong>
            </span>
            {savedBills.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-red-600 hover:text-red-700 font-medium text-xs underline cursor-pointer"
              >
                تمام صاف کریں
              </button>
            )}
          </div>
        </div>

        {/* List of bills */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {savedBills.length === 0
                ? 'ابھی تک کوئی بل محفوظ نہیں کیا گیا۔ بل بنانے کے بعد "محفوظ کریں" پر کلک کریں۔'
                : 'کوئی بل تلاش کے مطابق نہیں ملا۔'}
            </div>
          ) : (
            filtered.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {bill.customerName || 'عام گاہک (Cash Sale)'}
                    </span>
                    {bill.customerPhone && (
                      <span className="text-xs font-mono text-slate-500">
                        ({bill.customerPhone})
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {bill.dateStr}
                    </span>
                  </div>

                  {/* Cylinders summary */}
                  <div className="text-xs text-slate-600 flex flex-wrap gap-2">
                    <span>کل سلنڈر: <strong>{bill.totalCylinders}</strong></span>
                    <span>·</span>
                    <span>وزن: <strong>{bill.totalGasWeightKg} kg</strong></span>
                    <span>·</span>
                    <span className="text-slate-500">ریٹ: {formatPKR(bill.baseRatePKR)}</span>
                  </div>

                  {/* Roman Urdu in words */}
                  <div className="text-xs font-mono text-amber-700 truncate">
                    {bill.romanUrduWithNumber}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                    {formatPKR(bill.grandTotal)} <span className="text-xs font-normal">روپے</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadBill(bill)}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
                    >
                      دوبارہ کھولیں (Load)
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBill(bill.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
