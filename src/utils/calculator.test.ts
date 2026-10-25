import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePerKgRate,
  calculateBill,
  DEFAULT_CYLINDER_ITEMS,
} from './calculator.ts';
import {
  numberToRomanUrdu,
  getRomanUrduWithNumber,
  numberToUrduScript,
} from './numberWords.ts';

test('1 kg rate calculation matches user formula: 5500 / 11.8 = 466.10', () => {
  const rate = calculatePerKgRate(5500, 11.8);
  assert.equal(rate, 466.10);
});

test('Number to Roman Urdu words matches user exact string for 185,659', () => {
  const romanUrdu = numberToRomanUrdu(185659);
  assert.equal(romanUrdu, 'Ek lakh pachasi hazar chha sau unsath');

  const withNumber = getRomanUrduWithNumber(185659);
  assert.equal(withNumber, 'Ek lakh pachasi hazar chha sau unsath (185,659)');
});

test('Number to Urdu script words generates valid Urdu text', () => {
  const urdu = numberToUrduScript(185659);
  assert.equal(urdu, 'ایک لاکھ پچاسی ہزار چھ سو انسٹھ روپے');
});

test('Exact user scenario bill matches 185,659 grand total and exact line items', () => {
  const bill = calculateBill(5500, 11.8, 400, DEFAULT_CYLINDER_ITEMS);

  // 1. 35 kg x 4 cylinders
  const item35 = bill.items.find((i) => i.item.weightKg === 35);
  assert.ok(item35);
  assert.equal(item35.totalGasWeightKg, 140);
  assert.equal(item35.gasCost, 65254);
  assert.equal(item35.extraCost, 1600);
  assert.equal(item35.subtotal, 66854);

  // 2. 11.8 kg x 2 cylinders (direct rate, no 400)
  const item11 = bill.items.find((i) => i.item.weightKg === 11.8);
  assert.ok(item11);
  assert.equal(item11.gasCost, 11000);
  assert.equal(item11.extraCost, 0);
  assert.equal(item11.subtotal, 11000);

  // 3. 45.4 kg x 5 cylinders
  const item45 = bill.items.find((i) => i.item.weightKg === 45.4);
  assert.ok(item45);
  assert.equal(item45.totalGasWeightKg, 227);
  assert.equal(item45.gasCost, 105805);
  assert.equal(item45.extraCost, 2000);
  assert.equal(item45.subtotal, 107805);

  // Grand Total & Words
  assert.equal(bill.grandTotal, 185659);
  assert.equal(bill.totalCylinders, 11);
  assert.equal(bill.totalGasWeightKg, 390.6);
  assert.equal(bill.romanUrduWithNumber, 'Ek lakh pachasi hazar chha sau unsath (185,659)');
});

test('Zero cylinders produce 0 grand total', () => {
  const zeroItems = DEFAULT_CYLINDER_ITEMS.map((item) => ({ ...item, quantity: 0 }));
  const bill = calculateBill(5500, 11.8, 400, zeroItems);
  assert.equal(bill.grandTotal, 0);
  assert.equal(bill.totalCylinders, 0);
});

test('Custom rate calculation works smoothly', () => {
  // e.g. base rate 6000 for 11.8kg => 6000/11.8 = 508.47
  const perKg = calculatePerKgRate(6000, 11.8);
  assert.equal(perKg, 508.47);

  const customItems = [{
    id: 'test-1',
    name: '35 kg',
    urduName: '35 کلو',
    weightKg: 35,
    quantity: 1,
    isDirectRate: false,
    hasExtraCharge: true,
  }];
  const bill = calculateBill(6000, 11.8, 300, customItems);
  // gas: 35 * 508.47 = 17796.45 => 17796. extra: 300. subtotal: 18096.
  assert.equal(bill.grandTotal, 18096);
});
