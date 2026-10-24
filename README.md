# 🐍 اسنک KSGP (Snake KSGP)

بازی مار کلاسیک آنلاین با سیستم امتیاز **ksgp**، ۱۰ مرحله با سختی افزایشی، ورود با حساب گوگل و پنل ادمین.

## ویژگی‌ها

- ورود امن با **Google OAuth** (انتخاب حساب از بین حساب‌های گوگل)
- ۱۰ مرحله با سختی پیشرونده (مرحله ۱۰ بسیار سخت)
- هر امتیاز بازی = **۰.۰۰۰۰۰۱ ksgp**
- تکمیل مرحله آخر (سطح ۱۰) = جایزه **۱۰۰۰ ksgp**
- ذخیره پیشرفت و موجودی هر کاربر
- پنل ادمین مخصوص ایمیل `shapyaar@google.com`
- قابل استقرار روی **Render** با Docker
- پشتیبانی از موبایل (دکمه‌های لمسی + سوایپ)

> **توجه مهم:** ksgp در این پروژه فقط یک **امتیاز درون‌بازی** است و هیچ انتقال واقعی ارز دیجیتال یا توکن بلاک‌چینی انجام نمی‌شود.

---

## ۱. آماده‌سازی Google OAuth (حتماً انجام بده)

1. برو به [Google Cloud Console](https://console.cloud.google.com/)
2. یک پروژه جدید بساز (یا از پروژه موجود استفاده کن)
3. از منوی سمت چپ: **APIs & Services → Credentials**
4. **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. نام دلخواه بگذار (مثلاً Snake KSGP)
7. در بخش **Authorized JavaScript origins**:
   - `http://localhost:3000` (برای تست محلی)
   - `https://YOUR-APP-NAME.onrender.com` (بعد از دیپلوی)
8. در بخش **Authorized redirect URIs**:
   - `http://localhost:3000/auth/google/callback`
   - `https://YOUR-APP-NAME.onrender.com/auth/google/callback`
9. Create کن و **Client ID** و **Client Secret** را کپی کن.

---

## ۲. اجرا روی کامپیوتر خودت (تست محلی)

```bash
# کلون یا دانلود پروژه
cd snake-ksgp

# نصب وابستگی‌ها
npm install

# ساخت فایل .env
cp .env.example .env
```

فایل `.env` را ویرایش کن:

```env
PORT=3000
SESSION_SECRET=یک_رشته_تصادفی_خیلی_بلند_حداقل_۳۲_کاراکتر
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
CALLBACK_URL=http://localhost:3000/auth/google/callback
ADMIN_EMAIL=shapyaar@google.com
```

سپس:

```bash
npm start
```

برو به: http://localhost:3000

---

## ۳. آپلود روی GitHub

```bash
git init
git add .
git commit -m "اولین نسخه اسنک KSGP"
git branch -M main
git remote add origin https://github.com/USERNAME/snake-ksgp.git
git push -u origin main
```

(ریپازیتوری را روی GitHub بساز و آدرس را جایگزین کن)

---

## ۴. استقرار روی Render (رایگان)

1. برو به [render.com](https://render.com) و حساب بساز / وارد شو
2. **New → Web Service**
3. ریپازیتوری GitHub را وصل کن
4. تنظیمات:
   - **Name**: snake-ksgp (یا هر نامی)
   - **Environment**: Docker
   - **Region**: نزدیک‌ترین به خودت
   - **Plan**: Free
5. در بخش **Environment Variables** این‌ها را اضافه کن:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | یک رشته تصادفی بلند |
| `GOOGLE_CLIENT_ID` | Client ID گوگل |
| `GOOGLE_CLIENT_SECRET` | Client Secret گوگل |
| `CALLBACK_URL` | `https://YOUR-APP-NAME.onrender.com/auth/google/callback` |
| `ADMIN_EMAIL` | `shapyaar@google.com` |

6. **Create Web Service** بزن

بعد از دیپلوی، آدرس سایت را در Google Cloud Console (Authorized origins و redirect URIs) هم اضافه کن.

---

## ۵. نکات مهم Render (پلن رایگان)

- سرور بعد از حدود ۱۵ دقیقه بیکاری می‌خوابد (cold start حدود ۳۰–۶۰ ثانیه).
- فایل‌های داخل کانتینر (مثل `data/users.json`) با ری‌استارت از بین می‌روند.  
  برای نگهداری دائمی داده‌ها پیشنهاد می‌شود بعداً به **MongoDB Atlas** (رایگان) یا PostgreSQL Render متصل شوی.
- برای تست اولیه همین فایل JSON کافی است.

---

## ۶. ساختار سطوح بازی

| سطح | سرعت | اندازه صفحه | دیوار | تعداد مانع | هدف امتیاز |
|-----|------|-------------|-------|------------|------------|
| ۱   | کند  | ۲۰×۲۰       | خیر   | ۰          | ۵          |
| ۲   | ...  | ...         | ...   | ...        | ۸          |
| ... | ...  | ...         | ...   | ...        | ...        |
| ۱۰  | خیلی سریع | ۱۲×۱۲   | بله   | ۱۶         | ۳۰         |

مرحله ۱۰ طوری طراحی شده که رسیدن به آن و تکمیلش واقعاً سخت باشد.

---

## ۷. ادمین

- فقط ایمیلی که دقیقاً `shapyaar@google.com` باشد، دکمه «پنل ادمین» را می‌بیند.
- در پنل می‌توانی لیست تمام کاربران، موجودی ksgp، سطح و تعداد بازی‌ها را ببینی.

---

## ۸. دستورات مفید

```bash
# نصب
npm install

# اجرا
npm start

# ساخت تصویر داکر محلی (اختیاری)
docker build -t snake-ksgp .
docker run -p 3000:3000 --env-file .env snake-ksgp
```

---

## پشتیبانی و توسعه بعدی

اگر خواستی:
- اتصال به دیتابیس واقعی (MongoDB / Postgres)
- چندنفره آنلاین
- برداشت واقعی توکن (نیاز به قرارداد هوشمند و کیف پول)
- جدول رتبه‌بندی عمومی

بگو تا اضافه کنم.

موفق باشی! 🐍💚
