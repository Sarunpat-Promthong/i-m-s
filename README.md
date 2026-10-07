# 📚 I-M-S — Inventory Management System

> **EN:** A simple REST API for managing a book inventory, built with Node.js, Express and MongoDB, with multi-language error messages.
>
> **TH:** REST API สำหรับจัดการสต็อกหนังสือ สร้างด้วย Node.js, Express และ MongoDB รองรับข้อความหลายภาษา

---

## ✨ Features / ความสามารถ

| EN | TH |
|---|---|
| CRUD for books (create, read, update, delete) | เพิ่ม / ดู / แก้ไข / ลบ หนังสือ |
| Input validation before saving | ตรวจสอบข้อมูลก่อนบันทึก |
| Error messages in 5 languages: `en` `th` `zh` `es` `it` | ข้อความ error 5 ภาษา |
| Data stored in MongoDB via Mongoose | เก็บข้อมูลใน MongoDB ผ่าน Mongoose |

## 🧰 Tech stack / เทคโนโลยีที่ใช้

- **Express 5** — web server / เว็บเซิร์ฟเวอร์
- **Mongoose** — MongoDB models / จัดการโมเดลฐานข้อมูล
- **express-validator** — request validation / ตรวจสอบข้อมูลที่ส่งเข้ามา
- **i18next** — translations / ระบบแปลภาษา
- **dotenv** — load settings from `.env` / โหลดค่าตั้งค่าจาก `.env`
- **nodemon** — auto-restart while coding / รีสตาร์ทอัตโนมัติเมื่อแก้โค้ด

---

## 📁 Project structure / โครงสร้างโปรเจกต์

```
inventory-management/
├── index.js                  # Entry point: server, i18n, DB connection / จุดเริ่มต้น: เซิร์ฟเวอร์, ภาษา, ต่อฐานข้อมูล
├── routes/
│   └── book.routes.js        # API endpoints (/books) / เส้นทาง API
├── models/
│   └── book.model.js         # Book schema in MongoDB / โครงสร้างข้อมูลหนังสือ
├── validators/
│   └── book.validator.js     # Input rules + error handler / กฎตรวจข้อมูล
├── locales/                  # Translations / ไฟล์แปลภาษา
│   ├── en.json  th.json  zh.json  es.json  it.json
├── .env.example              # Example settings / ตัวอย่างค่าตั้งค่า
└── package.json
```

### 🔄 How a request flows / ลำดับการทำงานของ request

```
Request ──► i18n (detect language / ตรวจภาษา)
        ──► express.json() (read body / อ่าน body)
        ──► /books router
              ──► validator rules (กฎตรวจข้อมูล)
              ──► handleValidationErrors ──✖──► 400 + errors
              ──► route handler ──► Mongoose model ──► MongoDB
        ◄── JSON response (ข้อความตามภาษาที่ขอ)
```

---

## 🚀 Getting started / เริ่มต้นใช้งาน

**Requirements / สิ่งที่ต้องมี:** Node.js 20+ and MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

```bash
# 1. Clone / โคลนโปรเจกต์
git clone https://github.com/Sarunpat-Promthong/i-m-s.git
cd i-m-s

# 2. Install packages / ติดตั้งแพ็กเกจ
npm install

# 3. Create .env from the example / สร้างไฟล์ .env จากตัวอย่าง
cp .env.example .env        # Windows: copy .env.example .env

# 4. Run (auto-restart with nodemon) / รันเซิร์ฟเวอร์
npm start
```

You should see / จะเห็นข้อความ:

```
App listening on port 3000
Connected to MongoDB
```

### ⚙️ Environment variables / ตัวแปรใน `.env`

| Name | Required | Description (EN) | คำอธิบาย (TH) |
|---|---|---|---|
| `CONNECT_STRING` | ✅ | MongoDB connection string | ลิงก์เชื่อมต่อ MongoDB |
| `PORT` | ❌ | Server port (default `3000`) | พอร์ต (ค่าเริ่มต้น `3000`) |

> ⚠️ **EN:** Never commit `.env` — it is already in `.gitignore`.
> **TH:** ห้าม commit ไฟล์ `.env` (ใส่ไว้ใน `.gitignore` แล้ว)

---

## 📖 API

Base URL: `http://localhost:3000`

| Method | Path | EN | TH |
|---|---|---|---|
| `POST` | `/books` | Create a book | เพิ่มหนังสือ |
| `GET` | `/books` | List all books | ดูหนังสือทั้งหมด |
| `GET` | `/books/:id` | Get one book | ดูหนังสือ 1 เล่ม |
| `PUT` | `/books/:id` | Update a book (partial) | แก้ไขหนังสือ (ส่งเฉพาะฟิลด์ที่แก้ได้) |
| `DELETE` | `/books/:id` | Delete a book | ลบหนังสือ |

### 📦 Book fields / ฟิลด์ของหนังสือ

| Field | Type | Rule (EN) | กฎ (TH) |
|---|---|---|---|
| `bookName` | string | required, 5–200 chars | ต้องมี, 5–200 ตัวอักษร |
| `countInStock` | integer | required, 1–255 | ต้องมี, 1–255 |
| `price` | number | required, 1–10000 | ต้องมี, 1–10000 |
| `image` | string (URL) | required on create, must be http(s) URL | ต้องมีตอนสร้าง, ต้องเป็นลิงก์ http(s) |
| `dateCreated` | date | set automatically | ระบบใส่ให้อัตโนมัติ |
| `id` | string | auto (same as `_id`) | ระบบสร้างให้ (เหมือน `_id`) |

### 🧪 Examples / ตัวอย่าง

**Create / เพิ่มหนังสือ**

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"bookName":"Clean Code","countInStock":10,"price":450,"image":"https://example.com/clean-code.jpg"}'
```

**Update only the price / แก้เฉพาะราคา**

```bash
curl -X PUT http://localhost:3000/books/<id> \
  -H "Content-Type: application/json" \
  -d '{"price":399}'
```

**Validation error (400) / ข้อมูลไม่ผ่าน**

```json
{
  "errors": [
    { "type": "field", "msg": "Book name must be between 5 and 200 characters", "path": "bookName", "location": "body" }
  ]
}
```

---

## 🌐 Changing language / การเปลี่ยนภาษา

**EN:** The language is detected from (in order) the `?lng=` query, a cookie, or the `Accept-Language` header. Default is English.

**TH:** ระบบตรวจภาษาจาก `?lng=` ใน URL, cookie หรือ header `Accept-Language` ถ้าไม่ระบุจะใช้ภาษาอังกฤษ

```bash
curl "http://localhost:3000/books/000000000000000000000000?lng=th"
# => { "message": "ไม่พบหนังสือ" }

curl -H "Accept-Language: zh" http://localhost:3000/books/000000000000000000000000
```

### ➕ Add a new language / เพิ่มภาษาใหม่

1. **EN:** Copy `locales/en.json` to `locales/<code>.json` (e.g. `ja.json`). / **TH:** คัดลอก `locales/en.json` เป็น `locales/<รหัสภาษา>.json`
2. **EN:** Translate the values only — keep the keys the same. / **TH:** แปลเฉพาะ "ค่า" ห้ามเปลี่ยน "คีย์"
3. **EN:** Restart the server. / **TH:** รีสตาร์ทเซิร์ฟเวอร์

### ➕ Add a new message / เพิ่มข้อความใหม่

**EN:** Add the same key to **every** file in `locales/`, then use `req.t("yourKey")` in code.
**TH:** เพิ่มคีย์เดียวกันใน **ทุกไฟล์** ใน `locales/` แล้วเรียกใช้ด้วย `req.t("yourKey")`

---

## 📝 Notes for future me / บันทึกไว้อ่านทีหลัง

- **EN:** Field limits exist in **two places**: `validators/book.validator.js` (checks the request) and `models/book.model.js` (checks before saving). Change both together.
  **TH:** ขอบเขตของฟิลด์อยู่ **2 ที่**: validator (ตรวจ request) และ model (ตรวจก่อนบันทึก) ถ้าแก้ต้องแก้ทั้งสองที่
- **EN:** The locale key `bookNameLenghtValidation` is spelled "Lenght" on purpose to match all locale files — rename everywhere if you fix it.
  **TH:** คีย์ `bookNameLenghtValidation` สะกด "Lenght" ตรงกันทุกไฟล์ ถ้าจะแก้ต้องแก้ทุกที่พร้อมกัน

## 📄 License

ISC
