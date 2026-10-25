import {
  formatPKR,
  getRomanUrduWithNumber,
  numberToRomanUrdu,
  numberToUrduScript,
  numberToEnglishWords,
} from './numberWords.ts';

export interface CylinderItem {
  id: string;
  name: string;
  urduName: string;
  weightKg: number;
  quantity: number;
  isDirectRate: boolean; // true for 11.8kg (direct base price, no extra charge)
  hasExtraCharge: boolean; // whether to add the extra handling fee (e.g. 400 Rs)
  customPricePerKg?: number; // optional override
}

export interface CalculationResultItem {
  item: CylinderItem;
  totalGasWeightKg: number;
  gasPricePerKg: number;
  gasCost: number;
  extraCost: number;
  subtotal: number;
  note: string;
}

export interface BillCalculationResult {
  baseWeightKg: number;
  baseRatePKR: number;
  calculatedPerKgRate: number;
  extraPerCylinderPKR: number;
  items: CalculationResultItem[];
  totalCylinders: number;
  totalGasWeightKg: number;
  totalGasCost: number;
  totalExtraCost: number;
  grandTotal: number;
  romanUrduWords: string;
  romanUrduWithNumber: string;
  urduScriptWords: string;
  englishWords: string;
}

export const DEFAULT_BASE_WEIGHT = 11.8;
export const DEFAULT_BASE_RATE = 5500;
export const DEFAULT_EXTRA_SURCHARGE = 400;

export const DEFAULT_CYLINDER_ITEMS: CylinderItem[] = [
  {
    id: 'cyl-35',
    name: '35 kg Commercial Cylinder',
    urduName: '35 کلو والے سلنڈر',
    weightKg: 35,
    quantity: 4, // Default from user prompt
    isDirectRate: false,
    hasExtraCharge: true,
  },
  {
    id: 'cyl-11-8',
    name: '11.8 kg Domestic Cylinder',
    urduName: '11.8 کلو والے سلنڈر (گھریلو)',
    weightKg: 11.8,
    quantity: 2, // Default from user prompt
    isDirectRate: true,
    hasExtraCharge: false,
  },
  {
    id: 'cyl-45-4',
    name: '45.4 kg Commercial Cylinder',
    urduName: '45.4 کلو والے سلنڈر',
    weightKg: 45.4,
    quantity: 5, // Default from user prompt
    isDirectRate: false,
    hasExtraCharge: true,
  },
];

/**
 * Calculates 1 kg rate rounded to 2 decimal places.
 * 5,500 ÷ 11.8 = 466.10
 */
export function calculatePerKgRate(baseRate: number, baseWeight: number): number {
  if (baseWeight <= 0) return 0;
  return Number((baseRate / baseWeight).toFixed(2));
}

/**
 * Calculates a complete bill for all cylinder items.
 */
export function calculateBill(
  baseRate: number = DEFAULT_BASE_RATE,
  baseWeight: number = DEFAULT_BASE_WEIGHT,
  extraPerCylinder: number = DEFAULT_EXTRA_SURCHARGE,
  cylinderItems: CylinderItem[] = DEFAULT_CYLINDER_ITEMS,
  customPerKgRate?: number
): BillCalculationResult {
  const perKgRate = customPerKgRate ?? calculatePerKgRate(baseRate, baseWeight);

  let totalCylinders = 0;
  let totalGasWeightKg = 0;
  let totalGasCost = 0;
  let totalExtraCost = 0;
  let grandTotal = 0;

  const calculatedItems: CalculationResultItem[] = cylinderItems.map((item) => {
    const qty = Math.max(0, item.quantity || 0);
    const weight = Math.max(0, item.weightKg || 0);
    const gasWeight = Number((weight * qty).toFixed(2));

    let gasCost = 0;
    let extraCost = 0;
    let note = '';

    if (item.isDirectRate) {
      // Direct base rate applies without 400 Rs extra
      // e.g. 5,500 * 2 = 11,000
      gasCost = Math.round(baseRate * qty);
      extraCost = 0;
      note = 'اس میں 400 ایڈ نہیں ہوں گے، ڈائریکٹ ریٹ لگے گا۔';
    } else {
      // Commercial / per kg rate + extra handling
      // e.g. 140 kg * 466.10 = 65,254
      const rateToUse = item.customPricePerKg ?? perKgRate;
      gasCost = Math.round(gasWeight * rateToUse);

      if (item.hasExtraCharge) {
        extraCost = Math.round(extraPerCylinder * qty);
        note = `اضافی رقم (${formatPKR(extraPerCylinder)} × ${qty})`;
      } else {
        extraCost = 0;
        note = 'بغیر اضافی رقم کے';
      }
    }

    const subtotal = gasCost + extraCost;

    totalCylinders += qty;
    totalGasWeightKg += gasWeight;
    totalGasCost += gasCost;
    totalExtraCost += extraCost;
    grandTotal += subtotal;

    return {
      item,
      totalGasWeightKg: gasWeight,
      gasPricePerKg: item.isDirectRate ? Number((baseRate / weight).toFixed(2)) : (item.customPricePerKg ?? perKgRate),
      gasCost,
      extraCost,
      subtotal,
      note,
    };
  });

  totalGasWeightKg = Number(totalGasWeightKg.toFixed(2));

  return {
    baseWeightKg: baseWeight,
    baseRatePKR: baseRate,
    calculatedPerKgRate: perKgRate,
    extraPerCylinderPKR: extraPerCylinder,
    items: calculatedItems,
    totalCylinders,
    totalGasWeightKg,
    totalGasCost,
    totalExtraCost,
    grandTotal,
    romanUrduWords: numberToRomanUrdu(grandTotal),
    romanUrduWithNumber: getRomanUrduWithNumber(grandTotal),
    urduScriptWords: numberToUrduScript(grandTotal),
    englishWords: numberToEnglishWords(grandTotal),
  };
}

/**
 * Formats a clean, professional WhatsApp text receipt in Urdu & Roman Urdu.
 */
export function generateWhatsAppReceipt(
  bill: BillCalculationResult,
  customerName?: string,
  customerPhone?: string,
  invoiceNo?: string
): string {
  const dateStr = new Date().toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let message = `🔥 *ایل پی جی گیس سلنڈر بل* (LPG Gas Bill)\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (invoiceNo) message += `🧾 بل نمبر: ${invoiceNo}\n`;
  if (customerName) message += `👤 گاہک کا نام: ${customerName}\n`;
  if (customerPhone) message += `📞 فون: ${customerPhone}\n`;
  message += `📅 تاریخ: ${dateStr}\n\n`;

  message += `📌 *بنیادی ریٹ تفصیل:*\n`;
  message += `• بنیادی ریٹ (11.8 کلو): ${formatPKR(bill.baseRatePKR)} روپے\n`;
  message += `• 1 کلو کا ریٹ: ${bill.calculatedPerKgRate.toFixed(2)} روپے\n`;
  message += `• کمرشل اضافی رقم: ${formatPKR(bill.extraPerCylinderPKR)} روپے فی سلنڈر\n\n`;

  message += `📋 *سلنڈروں کی تفصیل:*\n`;
  bill.items.forEach((item, index) => {
    if (item.item.quantity > 0) {
      message += `${index + 1}. *${item.item.weightKg} کلو والے ${item.item.quantity} سلنڈر*\n`;
      if (item.item.isDirectRate) {
        message += `   • ڈائریکٹ ریٹ: ${formatPKR(bill.baseRatePKR)} × ${item.item.quantity} = ${formatPKR(item.subtotal)} روپے\n`;
      } else {
        message += `   • گیس وزن: ${item.item.weightKg} کلو × ${item.item.quantity} = ${item.totalGasWeightKg} کلو\n`;
        message += `   • گیس کی قیمت: ${formatPKR(item.gasCost)} روپے\n`;
        if (item.extraCost > 0) {
          message += `   • اضافی رقم: ${formatPKR(item.extraCost)} روپے\n`;
        }
        message += `   • ٹوٹل: ${formatPKR(item.subtotal)} روپے\n`;
      }
    }
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔢 کل سلنڈر: ${bill.totalCylinders}\n`;
  message += `⚖️ کل گیس وزن: ${bill.totalGasWeightKg} کلو\n`;
  message += `💰 *مکمل بل (Grand Total): ${formatPKR(bill.grandTotal)} روپے*\n`;
  message += `🗣️ *الفاظ میں:* ${bill.romanUrduWithNumber}\n`;
  message += `✍️ *اردو میں:* ${bill.urduScriptWords}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `شکریہ! آپ کے تعاون کا بہت شکریہ۔`;

  return message;
}
