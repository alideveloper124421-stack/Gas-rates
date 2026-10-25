import React from 'react';
import { Flame, RotateCcw, FileText, History } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  onNewBill: () => void;
  onOpenReceipt: () => void;
  onOpenHistory: () => void;
  savedBillsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewBill,
  onOpenReceipt,
  onOpenHistory,
  savedBillsCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-200">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                LPG Hisab Kitab
              </div>
              <div className="text-xs text-slate-500 font-urdu mt-0.5">
                ایل پی جی گیس حساب کتاب
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#section-rate"
              className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0"
            >
              1. ریٹ (Rate)
            </a>
            <a
              href="#section-cylinders"
              className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0"
            >
              2. سلنڈر (Cylinders)
            </a>
            <a
              href="#section-total"
              className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0"
            >
              3. بل (Total)
            </a>
            <button
              onClick={onOpenReceipt}
              className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>پرچی (Receipt)</span>
            </button>
            <button
              onClick={onOpenHistory}
              className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>ریکارڈ ({savedBillsCount})</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Install PWA + New Bill) */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            <button
              onClick={onNewBill}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer active:scale-95"
              title="Reset all inputs to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>نیا بل (New Bill)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
