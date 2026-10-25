/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { RateSection } from './components/RateSection.tsx';
import { CylinderSection } from './components/CylinderSection.tsx';
import { GrandTotalSection } from './components/GrandTotalSection.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import {
  CylinderItem,
  SavedBill,
} from './types.ts';
import {
  DEFAULT_BASE_RATE,
  DEFAULT_BASE_WEIGHT,
  DEFAULT_EXTRA_SURCHARGE,
  DEFAULT_CYLINDER_ITEMS,
  calculatePerKgRate,
  calculateBill,
} from './utils/calculator.ts';

const STORAGE_KEY_BILLS = 'lpg_hisab_saved_bills_v1';
const STORAGE_KEY_SETTINGS = 'lpg_hisab_settings_v1';

export default function App() {
  // Rate Section State (Section 1)
  const [baseRate, setBaseRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.baseRate) return parsed.baseRate;
      }
    } catch {
      // ignore
    }
    return DEFAULT_BASE_RATE;
  });

  const [baseWeight, setBaseWeight] = useState<number>(DEFAULT_BASE_WEIGHT);
  const [extraPerCylinder, setExtraPerCylinder] = useState<number>(DEFAULT_EXTRA_SURCHARGE);
  const [useCustomPerKgRate, setUseCustomPerKgRate] = useState<boolean>(false);
  const [customPerKgRate, setCustomPerKgRate] = useState<number>(466.10);

  // Cylinder Section State (Section 2)
  const [cylinderItems, setCylinderItems] = useState<CylinderItem[]>(() => {
    return DEFAULT_CYLINDER_ITEMS.map((item) => ({ ...item }));
  });

  // Customer & Bill Metadata
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Modals
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Saved Bills (100% Offline in LocalStorage)
  const [savedBills, setSavedBills] = useState<SavedBill[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BILLS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({
          baseRate,
          baseWeight,
          extraPerCylinder,
        })
      );
    } catch {
      // ignore
    }
  }, [baseRate, baseWeight, extraPerCylinder]);

  // Save bills whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BILLS, JSON.stringify(savedBills));
    } catch {
      // ignore
    }
  }, [savedBills]);

  // Derived calculated per-kg rate
  const derivedPerKgRate = useMemo(() => {
    return calculatePerKgRate(baseRate, baseWeight);
  }, [baseRate, baseWeight]);

  // Full Bill Calculation
  const billResult = useMemo(() => {
    return calculateBill(
      baseRate,
      baseWeight,
      extraPerCylinder,
      cylinderItems,
      useCustomPerKgRate ? customPerKgRate : undefined
    );
  }, [
    baseRate,
    baseWeight,
    extraPerCylinder,
    cylinderItems,
    useCustomPerKgRate,
    customPerKgRate,
  ]);

  // Quantity updater
  const handleUpdateQuantity = (id: string, qty: number) => {
    setCylinderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  // Add custom cylinder
  const handleAddCustomCylinder = (
    name: string,
    weightKg: number,
    hasExtra: boolean
  ) => {
    const newItem: CylinderItem = {
      id: `cyl-custom-${Date.now()}`,
      name,
      urduName: name,
      weightKg,
      quantity: 1,
      isDirectRate: false,
      hasExtraCharge: hasExtra,
    };
    setCylinderItems((prev) => [...prev, newItem]);
  };

  // Remove custom cylinder
  const handleRemoveCustomCylinder = (id: string) => {
    setCylinderItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset to default new bill
  const handleNewBill = () => {
    setCylinderItems(DEFAULT_CYLINDER_ITEMS.map((item) => ({ ...item, quantity: 0 })));
    setCustomerName('');
    setCustomerPhone('');
  };

  // Save current bill to offline history
  const handleSaveBill = () => {
    const newBill: SavedBill = {
      id: `bill-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      baseRatePKR: billResult.baseRatePKR,
      calculatedPerKgRate: billResult.calculatedPerKgRate,
      extraPerCylinderPKR: billResult.extraPerCylinderPKR,
      items: billResult.items
        .filter((i) => i.item.quantity > 0)
        .map((i) => ({
          name: i.item.name,
          urduName: i.item.urduName,
          weightKg: i.item.weightKg,
          quantity: i.item.quantity,
          subtotal: i.subtotal,
        })),
      totalCylinders: billResult.totalCylinders,
      totalGasWeightKg: billResult.totalGasWeightKg,
      grandTotal: billResult.grandTotal,
      romanUrduWithNumber: billResult.romanUrduWithNumber,
      urduScriptWords: billResult.urduScriptWords,
    };

    setSavedBills((prev) => [newBill, ...prev]);
  };

  // Load a saved bill
  const handleLoadBill = (saved: SavedBill) => {
    setBaseRate(saved.baseRatePKR);
    setExtraPerCylinder(saved.extraPerCylinderPKR);
    if (saved.customerName) setCustomerName(saved.customerName);
    if (saved.customerPhone) setCustomerPhone(saved.customerPhone);

    // reconstruct items
    const updated = DEFAULT_CYLINDER_ITEMS.map((def) => {
      const match = saved.items.find((si) => si.weightKg === def.weightKg);
      return {
        ...def,
        quantity: match ? match.quantity : 0,
      };
    });
    setCylinderItems(updated);
    setShowHistory(false);
  };

  // Delete a saved bill
  const handleDeleteBill = (id: string) => {
    setSavedBills((prev) => prev.filter((b) => b.id !== id));
  };

  // Clear all saved bills
  const handleClearAllSaved = () => {
    if (window.confirm('کیا آپ تمام محفوظ شدہ بل ختم کرنا چاہتے ہیں؟')) {
      setSavedBills([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        onNewBill={handleNewBill}
        onOpenReceipt={() => setShowReceipt(true)}
        onOpenHistory={() => setShowHistory(true)}
        savedBillsCount={savedBills.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Section 1: اوپر مین ریٹ کی جگہ */}
        <RateSection
          baseRate={baseRate}
          setBaseRate={setBaseRate}
          baseWeight={baseWeight}
          setBaseWeight={setBaseWeight}
          perKgRate={derivedPerKgRate}
          extraPerCylinder={extraPerCylinder}
          setExtraPerCylinder={setExtraPerCylinder}
          useCustomPerKgRate={useCustomPerKgRate}
          setUseCustomPerKgRate={setUseCustomPerKgRate}
          customPerKgRate={customPerKgRate}
          setCustomPerKgRate={setCustomPerKgRate}
        />

        {/* Section 2: سلنڈروں کی تعداد اور حساب */}
        <CylinderSection
          items={cylinderItems}
          calculatedItems={billResult.items}
          onUpdateQuantity={handleUpdateQuantity}
          onAddCustomCylinder={handleAddCustomCylinder}
          onRemoveCustomCylinder={handleRemoveCustomCylinder}
          baseRate={baseRate}
          perKgRate={derivedPerKgRate}
          extraPerCylinder={extraPerCylinder}
        />

        {/* Section 3: مکمل بل اور الفاظ میں کاؤنٹنگ */}
        <GrandTotalSection
          bill={billResult}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          onOpenReceipt={() => setShowReceipt(true)}
          onSaveBill={handleSaveBill}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">LPG Gas Rate & Bill Calculator</span>
            {' · '}
            <span>ایل پی جی گیس حساب کتاب</span>
          </div>
          <div className="flex items-center gap-4">
            <span>آف لائن موڈ فعال ہے (100% Offline Compatible)</span>
            <span>·</span>
            <span>Local Storage Saved</span>
          </div>
        </div>
      </footer>

      {/* Receipt Preview Modal */}
      {showReceipt && (
        <ReceiptModal
          bill={billResult}
          customerName={customerName}
          customerPhone={customerPhone}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* Offline History Modal */}
      {showHistory && (
        <HistoryModal
          savedBills={savedBills}
          onLoadBill={handleLoadBill}
          onDeleteBill={handleDeleteBill}
          onClearAll={handleClearAllSaved}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
