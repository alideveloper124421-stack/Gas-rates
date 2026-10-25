# LPG Gas Cylinder Rate & Bill Calculator (ایل پی جی حساب کتاب)

LPG gas cylinder rate calculator and offline billing system with accurate per-kg calculations, commercial extra surcharge handling, Roman Urdu in-words counting, WhatsApp invoice sharing, receipt printing, and full PWA mobile app support.

---

## 🚀 Features (خصوصیات)

- **بنیادی ریٹ (Base Rate & Per-Kg Rate):**
  - Domestic 11.8 kg base price input (e.g. 5,500 Rs)
  - Automatic 1 kg rate formula: `5,500 ÷ 11.8 = 466.10 روپے`
  - Commercial extra surcharge (e.g. 400 Rs for 35kg & 45.4kg cylinders)
- **سلنڈروں کی تعداد اور حساب (Cylinder Breakdown):**
  - **35 kg Commercial Cylinder:** Gas weight (`35 × qty`), gas cost, extra charge (`400 × qty`), line subtotal.
  - **11.8 kg Domestic Cylinder:** Direct base rate without extra charge (`5,500 × qty`).
  - **45.4 kg Commercial Cylinder:** Gas weight (`45.4 × qty`), gas cost, extra charge (`400 × qty`), line subtotal.
  - **Custom Cylinders:** Add any custom weight (e.g. 6kg, 15kg) with optional surcharge.
- **مکمل بل اور الفاظ میں کاؤنٹنگ (Grand Total & In-Words):**
  - Grand Total (e.g. `185,659 روپے`)
  - **Roman Urdu In-Words:** `Ek lakh pachasi hazar chha sau unsath (185,659)`
  - **Urdu Script:** `ایک لاکھ پچاسی ہزار چھ سو انسٹھ روپے`
- **موبائل ایپ (Mobile PWA & 100% Offline):**
  - Installable directly on Android & iOS home screen like a native mobile app.
  - Works 100% offline without internet connection.
  - Offline billing history saved in device LocalStorage.
  - One-click WhatsApp invoice sharing & print-ready receipts.

---

## 📱 موبائل میں چلانے کا طریقہ (Run on Mobile)

### طریقہ 1: GitHub Pages پر فری ہوسٹ کرنا (سب سے آسان)
1. اپنے کوڈ کو GitHub پر پش کریں (نیچے دیے گئے طریقے کے مطابق)۔
2. گٹ ہب ریپو کی **Settings** میں جائیں ➔ بائیں طرف **Pages** پر کلک کریں۔
3. **Build and deployment** کے نیچے **Source** کو **`GitHub Actions`** پر سیٹ کر دیں۔
4. آپ کی سائٹ تیار ہو جائے گی (مثلاً: `https://your-username.github.io/your-repo/`)۔
5. اس لنک کو اپنے موبائل فون پر کھولیں:
   - **Android Chrome:** اوپر یا سکرین پر **"ایپ انسٹال کریں (Install App)"** یا تھری ڈاٹس مینو میں **"Add to Home screen / Install"** دبائیں۔
   - **iPhone Safari:** نیچے شیئر بٹن (Share icon) پر کلک کر کے **"Add to Home Screen"** منتخب کریں۔
6. اب یہ ایپ آپ کے موبائل کی سکرین پر عام موبائل ایپ کی طرح بن جائے گی اور بنا انٹرنیٹ کے چلے گی!

---

## 🛠️ GitHub پر اپلوڈ کرنے کا طریقہ (Push to GitHub)

ٹرمینل میں یہ کمانڈز چلائیں:

```bash
# 1. گٹ شروع کریں
git init

# 2. تمام فائلز شامل کریں
git add .

# 3. کمٹ کریں
git commit -m "feat: complete LPG cylinder rate calculator and PWA mobile app"

# 4. مین برانچ سیٹ کریں
git branch -M main

# 5. اپنے گٹ ہب ریپو کا لنک لگائیں
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# 6. پش کریں (GitHub Actions خود بخود بلڈ کر دے گا)
git push -u origin main
```

---

## 💻 لوکل ڈویلپمنٹ (Local Development)

```bash
# انسٹال کریں
npm install

# ٹیسٹ چلائیں
npm test

# ڈویلپمنٹ سرور چلائیں
npm run dev

# پروڈکشن بلڈ بنائیں
npm run build
```
