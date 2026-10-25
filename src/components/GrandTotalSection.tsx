import React, { useState } from 'react';
import { BillCalculationResult } from '../types.ts';
import {
  Copy,
  Check,
  Share2,
  Printer,
  BookmarkCheck,
  User,
  Phone,
} from 'lucide-react';
import { formatPKR } from '../utils/numberWords.ts';
import { generateWhatsAppReceipt } from '../utils/calculator.ts';

interface GrandTotalSectionProps {
  bill: BillCalculationResult;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  onOpenReceipt: () => void;
  onSaveBill: () => void;
}

export const GrandTotalSection: React.FC<GrandTotalSectionProps> = ({
  bill,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  onOpenReceipt,
  onSaveBill,
}) => {
  const [copiedRoman, setCopiedRoman] = useState(false);
  const [copiedFullBill, setCopiedFullBill] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCustomerFields, setShowCustomerFields] = useState(false);

  const handleCopyRomanWords = () => {
    navigator.clipboard.writeText(bill.romanUrduWithNumber);
    setCopiedRoman(true);
    setTimeout(() => setCopiedRoman(false), 2000);
  };

  const handleCopyFullBill = () => {
    const text = generateWhatsAppReceipt(bill, customerName, customerPhone);
    navigator.clipboard.writeText(text);
    setCopiedFullBill(true);
    setTimeout(() => setCopiedFullBill(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppReceipt(bill, customerName, customerPhone);
    const encoded = encodeURIComponent(text);
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSaveWithFeedback = () => {
    onSaveBill();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section id="section-total" className="scroll-mt-20">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
        {/* Simple Section Header */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">
              مکمل بل (Grand Total)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomerFields(!showCustomerFields)}
            className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            {showCustomerFields ? 'گاہک کی معلومات چھپائیں' : '+ گاہک کا نام / فون نمبر'}
          </button>
        </div>

        {/* Optional Customer Name & Phone Fields */}
        {showCustomerFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="گاہک کا نام (Customer Name)"
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="موبائل / واٹس ایپ نمبر (0300...)"
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Main Grand Total Banner */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              مکمل بل رقم (Grand Total)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              کل سلنڈر: <strong className="text-white">{bill.totalCylinders}</strong> · کل گیس: <strong className="text-white">{bill.totalGasWeightKg} kg</strong>
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight tabular-nums">
              {formatPKR(bill.grandTotal)}
            </span>
            <span className="text-xl font-bold text-amber-400">
              روپے
            </span>
          </div>

          {/* THE PROMINENT IN-WORDS COUNTING BOX (EXACT USER REQUIREMENT) */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                الفاظ میں کاؤنٹنگ (In-Words):
              </span>
              <button
                type="button"
                onClick={handleCopyRomanWords}
                className="flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedRoman ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">کاپی ہو گیا!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کاپی</span>
                  </>
                )}
              </button>
            </div>

            {/* Exact Roman Urdu with Number */}
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 tracking-wide">
              {bill.romanUrduWithNumber}
            </div>

            {/* Urdu Nastaliq */}
            <div className="mt-1.5 text-xs text-slate-300 font-urdu">
              {bill.urduScriptWords}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>واٹس ایپ (WhatsApp)</span>
          </button>

          <button
            type="button"
            onClick={onOpenReceipt}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>پرچی پرنٹ (Receipt)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveWithFeedback}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>محفوظ ہو گیا!</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>محفوظ کریں (Save)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyFullBill}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            {copiedFullBill ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">کاپی ہو گیا!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>بل کاپی کریں</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
