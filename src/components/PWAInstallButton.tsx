import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed standalone app, hide button
  if (isInstalled) {
    return null;
  }

  // Android / Chrome / Edge installation prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs active:scale-95"
        title="موبائل ایپ انسٹال کریں"
      >
        <Download className="w-3.5 h-3.5" />
        <span>ایپ انسٹال کریں (Install)</span>
      </button>
    );
  }

  // iOS Safari installation instructions
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>آئی فون ایپ (Install)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  آئی فون پر ایپ لگائیں (Add to Home Screen)
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                1. نیچے سفاری کے <strong>Share</strong> بٹن پر ٹیپ کریں۔<br />
                2. لسٹ میں نیچے سکرول کر کے <strong>Add to Home Screen</strong> منتخب کریں۔
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                سمجھ آگیا (Done)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
