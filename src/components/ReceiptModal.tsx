import React from 'react';
import { BillCalculationResult } from '../types.ts';
import { X, Printer, Flame, Share2, Check } from 'lucide-react';
import { formatPKR } from '../utils/numberWords.ts';
import { generateWhatsAppReceipt } from '../utils/calculator.ts';

interface ReceiptModalProps {
  bill: BillCalculationResult;
  customerName: string;
  customerPhone: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  bill,
  customerName,
  customerPhone,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = generateWhatsAppReceipt(bill, customerName, customerPhone);
    const encoded = encodeURIComponent(text);
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const invoiceNo = `LPG-${Math.floor(Date.now() / 1000).toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Bar (hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold">ایل پی جی بل رسید (Receipt Preview)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close receipt modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white font-sans text-slate-800">
          {/* Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-2">
              <Flame className="w-7 h-7 fill-amber-500 text-amber-600" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              LPG Gas Agency & Cylinder Service
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ایل پی جی گیس سلنڈر بل و کیش میمو
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>بل نمبر: <strong className="font-mono">{invoiceNo}</strong></span>
              <span>{dateStr} · {timeStr}</span>
            </div>
          </div>

          {/* Customer Info */}
          {(customerName || customerPhone) && (
            <div className="py-3 border-b border-dashed border-slate-300 text-xs">
              {customerName && (
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">گاہک کا نام:</span>
                  <span className="font-bold text-slate-900">{customerName}</span>
                </div>
              )}
              {customerPhone && (
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">فون / موبائل:</span>
                  <span className="font-mono font-bold text-slate-900">{customerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Rates Info */}
          <div className="py-2.5 bg-slate-50 rounded-lg my-3 px-3 text-xs text-slate-700">
            <div className="flex justify-between py-0.5">
              <span>بنیادی ریٹ (11.8 کلو):</span>
              <span className="font-mono font-bold">{formatPKR(bill.baseRatePKR)} روپے</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>1 کلو گیس کا ریٹ:</span>
              <span className="font-mono font-bold">{bill.calculatedPerKgRate.toFixed(2)} روپے</span>
            </div>
            {bill.extraPerCylinderPKR > 0 && (
              <div className="flex justify-between py-0.5">
                <span>کمرشل اضافی رقم:</span>
                <span className="font-mono font-bold">{formatPKR(bill.extraPerCylinderPKR)} روپے فی سلنڈر</span>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="py-2 border-b border-dashed border-slate-300">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-right py-1.5 font-semibold">تفصیل سلنڈر</th>
                  <th className="text-center py-1.5 font-semibold">تعداد</th>
                  <th className="text-center py-1.5 font-semibold">گیس وزن</th>
                  <th className="text-left py-1.5 font-semibold">ٹوٹل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bill.items.map((row) => {
                  if (row.item.quantity === 0) return null;
                  return (
                    <tr key={row.item.id} className="py-1.5">
                      <td className="py-2 text-right">
                        <div className="font-bold text-slate-900">
                          {row.item.weightKg} کلو سلنڈر
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {row.item.isDirectRate
                            ? 'ڈائریکٹ ریٹ'
                            : row.extraCost > 0
                            ? `گیس ${formatPKR(row.gasCost)} + اضافی ${formatPKR(row.extraCost)}`
                            : 'کمرشل ریٹ'}
                        </div>
                      </td>
                      <td className="py-2 text-center font-mono font-semibold">
                        {row.item.quantity}
                      </td>
                      <td className="py-2 text-center font-mono text-slate-600">
                        {row.totalGasWeightKg} kg
                      </td>
                      <td className="py-2 text-left font-mono font-bold text-slate-900">
                        {formatPKR(row.subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotals & Grand Total */}
          <div className="py-3 border-b-2 border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">کل سلنڈرز (Total Cylinders):</span>
              <span className="font-mono font-bold">{bill.totalCylinders} عدد</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">کل گیس وزن (Total Weight):</span>
              <span className="font-mono font-bold">{bill.totalGasWeightKg} kg</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-medium">گیس رقم (Gas Subtotal):</span>
              <span className="font-mono font-bold">{formatPKR(bill.totalGasCost)} روپے</span>
            </div>
            {bill.totalExtraCost > 0 && (
              <div className="flex justify-between items-center text-amber-800">
                <span className="font-medium">اضافی رقم (Commercial Extra):</span>
                <span className="font-mono font-bold">+{formatPKR(bill.totalExtraCost)} روپے</span>
              </div>
            )}
            <div className="flex items-baseline justify-between pt-2 border-t border-slate-300 text-slate-900">
              <span className="text-sm font-extrabold">مکمل بل (Grand Total):</span>
              <span className="text-xl font-extrabold font-mono text-amber-700">
                {formatPKR(bill.grandTotal)} روپے
              </span>
            </div>
          </div>

          {/* In Words Section */}
          <div className="pt-3 pb-2 text-xs text-slate-700">
            <div className="text-[11px] font-semibold text-slate-500 mb-0.5">
              رقم الفاظ میں (Amount in Words):
            </div>
            <div className="font-mono font-bold text-slate-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {bill.romanUrduWithNumber}
            </div>
            <div className="mt-1.5 text-slate-600 font-urdu">
              {bill.urduScriptWords}
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center pt-4 text-[11px] text-slate-500 border-t border-dashed border-slate-300">
            <p>خریداری پر آپ کا بہت شکریہ!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              یہ کمپیوٹر سے تیار کردہ بل ہے۔
            </p>
          </div>
        </div>

        {/* Modal Bottom Controls (hidden during print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>واٹس ایپ پر بھیجیں</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              بند کریں
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
