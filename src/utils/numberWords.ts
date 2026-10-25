/**
 * Converts numbers into Roman Urdu words (e.g. "Ek lakh pachasi hazar chha sau unsath"),
 * Urdu Nastaliq words (e.g. "ایک لاکھ پچاسی ہزار چھ سو انسٹھ روپے"),
 * and English words (e.g. "One Lakh Eighty-Five Thousand Six Hundred Fifty-Nine Rupees").
 */

export const romanUrduUnits = [
  'shifar',
  'ek',
  'do',
  'teen',
  'chaar',
  'paanch',
  'chha',
  'saat',
  'aath',
  'nau',
  'das',
  'gyarah',
  'barah',
  'terah',
  'chaudah',
  'pandrah',
  'solah',
  'satrah',
  'atharah',
  'unnees',
  'bees',
  'ikkees',
  'baees',
  'teyees',
  'chaubees',
  'pachchees',
  'chhabbees',
  'sattaees',
  'atthaees',
  'untees',
  'tees',
  'ikattees',
  'battees',
  'tentees',
  'chauntees',
  'paintees',
  'chhattees',
  'saintees',
  'athtees',
  'untaalees',
  'chaalees',
  'iktaalees',
  'bayaalees',
  'tentaalees',
  'chawaalees',
  'paintalees',
  'chhiyalees',
  'saintalees',
  'adhtaalees',
  'unchaas',
  'pachaas',
  'ikyawan',
  'baawan',
  'tirpan',
  'chawwan',
  'pachpan',
  'chhappan',
  'sattawan',
  'atthaawan',
  'unsath', // 59: explicitly matches user's request
  'saath',
  'iksat',
  'baasat',
  'tirasat',
  'chaunsat',
  'painsat',
  'chhiyasat',
  'sadsat',
  'adsat',
  'unhattar',
  'sattar',
  'ikhattar',
  'bahattar',
  'tihattar',
  'chauhattar',
  'pachhattar',
  'chhiyahattar',
  'sathattar',
  'athahattar',
  'unasi',
  'assi',
  'ikyasi',
  'bayasi',
  'tirasi',
  'chaurasi',
  'pachasi', // 85: explicitly matches user's request
  'chhiyasi',
  'sattasi',
  'athasi',
  'nawasi',
  'nabbe',
  'ikyanway',
  'baanway',
  'tiranway',
  'chauranway',
  'pachanway',
  'chhiyanway',
  'sattanway',
  'atthanway',
  'ninyanway',
];

export const urduScriptUnits = [
  'صفر',
  'ایک',
  'دو',
  'تین',
  'چار',
  'پانچ',
  'چھ',
  'سات',
  'آٹھ',
  'نو',
  'دس',
  'گیارہ',
  'بارہ',
  'تیرہ',
  'چودہ',
  'پندرہ',
  'سولہ',
  'سترہ',
  'اٹھارہ',
  'انیس',
  'بیس',
  'اکیس',
  'بائیس',
  'تیئیس',
  'چوبیس',
  'پچیس',
  'چھبیس',
  'ستائیس',
  'اٹھائیس',
  'انتیس',
  'تیس',
  'اکتیس',
  'بتیس',
  'تینتیس',
  'چونتیس',
  'پینتیس',
  'چھتیس',
  'سینتیس',
  'اڑتیس',
  'انتالیس',
  'چالیس',
  'اکتالیس',
  'بیالیس',
  'تینتالیس',
  'چوالیس',
  'پینتالیس',
  'چھیاسٹھ',
  'سینتالیس',
  'اڑتالیس',
  'انچاس',
  'پچاس',
  'اکیاون',
  'باون',
  'ترپن',
  'چون',
  'پچپن',
  'چھپن',
  'ستاون',
  'اٹاون',
  'انسٹھ',
  'ساٹھ',
  'اکسٹھ',
  'باسٹھ',
  'تریسٹھ',
  'چونسٹھ',
  'پینسٹھ',
  'چھیاسٹھ',
  'سڑسٹھ',
  'اڑسٹھ',
  'انہتر',
  'ستر',
  'اکہتر',
  'بہتر',
  'تہتر',
  'چوہتر',
  'پچہتر',
  'چھہتر',
  'ستتر',
  'اٹھہتر',
  'اناسی',
  'اسی',
  'اکیاسی',
  'بیاسی',
  'تراسی',
  'چوراسی',
  'پچاسی',
  'چھیاسی',
  'ستاسی',
  'اٹیاسی',
  'نواسی',
  'نوے',
  'اکیانوے',
  'بانوے',
  'ترانوے',
  'چورانوے',
  'پچانوے',
  'چھیانوے',
  'ستانوے',
  'اٹانوے',
  'ننانوے',
];

const englishUnits = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const englishTens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

/**
 * Formats a number in Pakistani / South Asian comma style:
 * e.g. 185659 -> "1,85,659" or standard international "185,659"
 */
export function formatPKR(num: number): string {
  const rounded = Math.round(num);
  return new Intl.NumberFormat('en-PK').format(rounded);
}

/**
 * Converts a number (up to 99 Crore) into Roman Urdu words.
 * Specifically capitalizes the first letter e.g. "Ek lakh pachasi hazar chha sau unsath (185,659)"
 */
export function numberToRomanUrdu(num: number): string {
  const n = Math.round(Math.abs(num));
  if (n === 0) return 'shifar';

  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  const remCrore = n % 10000000;

  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;

  const hazar = Math.floor(remLakh / 1000);
  const remHazar = remLakh % 1000;

  const sau = Math.floor(remHazar / 100);
  const remSau = remHazar % 100;

  if (crore > 0) {
    parts.push(`${romanUrduUnits[crore] || crore} crore`);
  }

  if (lakh > 0) {
    parts.push(`${romanUrduUnits[lakh] || lakh} lakh`);
  }

  if (hazar > 0) {
    parts.push(`${romanUrduUnits[hazar] || hazar} hazar`);
  }

  if (sau > 0) {
    parts.push(`${romanUrduUnits[sau] || sau} sau`);
  }

  if (remSau > 0) {
    parts.push(romanUrduUnits[remSau]);
  }

  const result = parts.join(' ').trim();
  // Capitalize first character
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Converts a number to the exact formatted text requested by user:
 * "Ek lakh pachasi hazar chha sau unsath (185,659)"
 */
export function getRomanUrduWithNumber(num: number): string {
  const words = numberToRomanUrdu(num);
  const formattedNum = new Intl.NumberFormat('en-US').format(Math.round(num));
  return `${words} (${formattedNum})`;
}

/**
 * Converts number to Urdu script words.
 */
export function numberToUrduScript(num: number): string {
  const n = Math.round(Math.abs(num));
  if (n === 0) return 'صفر روپے';

  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  const remCrore = n % 10000000;

  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;

  const hazar = Math.floor(remLakh / 1000);
  const remHazar = remLakh % 1000;

  const sau = Math.floor(remHazar / 100);
  const remSau = remHazar % 100;

  if (crore > 0) {
    parts.push(`${urduScriptUnits[crore] || crore} کروڑ`);
  }

  if (lakh > 0) {
    parts.push(`${urduScriptUnits[lakh] || lakh} لاکھ`);
  }

  if (hazar > 0) {
    parts.push(`${urduScriptUnits[hazar] || hazar} ہزار`);
  }

  if (sau > 0) {
    parts.push(`${urduScriptUnits[sau] || sau} سو`);
  }

  if (remSau > 0) {
    parts.push(urduScriptUnits[remSau]);
  }

  return `${parts.join(' ')} روپے`;
}

/**
 * Converts number to English words (South Asian Lakh / Crore system)
 */
export function numberToEnglishWords(num: number): string {
  const n = Math.round(Math.abs(num));
  if (n === 0) return 'Zero Rupees';

  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  const remCrore = n % 10000000;

  const lakh = Math.floor(remCrore / 100000);
  const remLakh = remCrore % 100000;

  const hazar = Math.floor(remLakh / 1000);
  const remHazar = remLakh % 1000;

  const sau = Math.floor(remHazar / 100);
  const remSau = remHazar % 100;

  function twoDigits(val: number): string {
    if (val < 20) return englishUnits[val];
    const tens = Math.floor(val / 10);
    const ones = val % 10;
    return ones > 0 ? `${englishTens[tens]}-${englishUnits[ones]}` : englishTens[tens];
  }

  if (crore > 0) {
    parts.push(`${twoDigits(crore)} Crore`);
  }

  if (lakh > 0) {
    parts.push(`${twoDigits(lakh)} Lakh`);
  }

  if (hazar > 0) {
    parts.push(`${twoDigits(hazar)} Thousand`);
  }

  if (sau > 0) {
    parts.push(`${englishUnits[sau]} Hundred`);
  }

  if (remSau > 0) {
    parts.push(twoDigits(remSau));
  }

  return `${parts.join(' ')} Rupees`;
}
