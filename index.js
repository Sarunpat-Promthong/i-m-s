/**
 * index.js — Entry point of the app / จุดเริ่มต้นของแอป
 *
 * EN: This file starts the Express server, sets up multi-language support (i18n),
 *     connects to MongoDB and registers the /books routes.
 * TH: ไฟล์นี้ใช้เปิดเซิร์ฟเวอร์ Express, ตั้งค่าระบบหลายภาษา (i18n),
 *     เชื่อมต่อ MongoDB และผูกเส้นทาง (route) /books เข้ากับแอป
 */

// EN: Load variables from .env into process.env (must run first).
// TH: โหลดค่าจากไฟล์ .env เข้า process.env (ต้องทำก่อนส่วนอื่น)
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const i18next = require("i18next");
const backend = require("i18next-fs-backend"); // EN: reads translation files from disk / TH: อ่านไฟล์แปลภาษาจากดิสก์
const middleware = require("i18next-http-middleware"); // EN: detects language per request / TH: ตรวจจับภาษาของแต่ละ request
const bookRouter = require("./routes/book.routes");

const app = express();

// EN: Use PORT from .env if set, otherwise default to 3000.
// TH: ใช้ PORT จาก .env ถ้ามี ถ้าไม่มีใช้ 3000
const port = process.env.PORT || 3000;

/* ------------------------------------------------------------------
 * i18n (multi-language) setup / ตั้งค่าระบบหลายภาษา
 * EN: Language is detected from ?lng=th (query), cookie, or the
 *     "Accept-Language" header. Falls back to English.
 * TH: ภาษาจะถูกตรวจจากพารามิเตอร์ ?lng=th, cookie หรือ header
 *     "Accept-Language" ถ้าไม่เจอจะใช้ภาษาอังกฤษ
 * ------------------------------------------------------------------ */
i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      // EN: {{lng}} is replaced by the language code, e.g. locales/th.json
      // TH: {{lng}} จะถูกแทนด้วยรหัสภาษา เช่น locales/th.json
      loadPath: "locales/{{lng}}.json",
    },
  });

/* ------------------------------------------------------------------
 * Middlewares / มิดเดิลแวร์ (ทำงานก่อนเข้าถึง route)
 * ------------------------------------------------------------------ */
// EN: Adds req.t("key") so routes can return translated messages.
// TH: เพิ่มฟังก์ชัน req.t("key") ให้ route ใช้ดึงข้อความตามภาษา
app.use(middleware.handle(i18next));

// EN: Parse JSON request bodies into req.body.
// TH: แปลง body ที่เป็น JSON ให้อยู่ใน req.body
app.use(express.json());

/* ------------------------------------------------------------------
 * Routes / เส้นทาง API
 * EN: Every URL starting with /books is handled by routes/book.routes.js
 * TH: ทุก URL ที่ขึ้นต้นด้วย /books จะไปทำงานที่ routes/book.routes.js
 * ------------------------------------------------------------------ */
app.use("/books", bookRouter);

/* ------------------------------------------------------------------
 * Start server + connect database / เปิดเซิร์ฟเวอร์และเชื่อมต่อฐานข้อมูล
 * ------------------------------------------------------------------ */
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// EN: CONNECT_STRING comes from .env (see .env.example).
// TH: CONNECT_STRING มาจากไฟล์ .env (ดูตัวอย่างใน .env.example)
mongoose
  .connect(process.env.CONNECT_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));
