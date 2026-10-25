export interface CylinderItem {
  id: string;
  name: string;
  urduName: string;
  weightKg: number;
  quantity: number;
  isDirectRate: boolean;
  hasExtraCharge: boolean;
  customPricePerKg?: number;
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

export interface SavedBill {
  id: string;
  timestamp: number;
  dateStr: string;
  customerName?: string;
  customerPhone?: string;
  baseRatePKR: number;
  calculatedPerKgRate: number;
  extraPerCylinderPKR: number;
  items: Array<{
    name: string;
    urduName: string;
    weightKg: number;
    quantity: number;
    subtotal: number;
  }>;
  totalCylinders: number;
  totalGasWeightKg: number;
  grandTotal: number;
  romanUrduWithNumber: string;
  urduScriptWords: string;
}
