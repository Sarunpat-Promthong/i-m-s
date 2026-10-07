/**
 * validators/book.validator.js — Request validation / ตรวจสอบข้อมูลที่ส่งเข้ามา
 *
 * EN: Uses express-validator to check req.body / req.params BEFORE touching
 *     the database. Error messages are translated with req.t("key")
 *     (keys live in locales/*.json).
 * TH: ใช้ express-validator ตรวจ req.body / req.params ก่อนเข้าถึงฐานข้อมูล
 *     ข้อความ error แปลภาษาด้วย req.t("key") (คีย์อยู่ในไฟล์ locales/*.json)
 *
 * NOTE: Keep limits in sync with models/book.model.js
 * หมายเหตุ: ค่าขอบเขตต้องตรงกับใน models/book.model.js
 */
const { body, validationResult, param } = require("express-validator");

/* ------------------------------------------------------------------
 * Create rules (POST) — every field is required
 * กฎตอนสร้าง (POST) — ทุกฟิลด์ต้องมี
 * ------------------------------------------------------------------ */
const createBookValidation = [
  // EN: bookName: required, 5–200 chars / TH: ต้องมี ยาว 5–200 ตัวอักษร
  body("bookName")
    .notEmpty()
    .withMessage((value, { req }) => req.t("bookNameRequired"))
    .isLength({ min: 5, max: 200 })
    .withMessage((value, { req }) => req.t("bookNameLenghtValidation")),

  // EN: countInStock: required, integer 1–255 / TH: ต้องมี เป็นจำนวนเต็ม 1–255
  body("countInStock")
    .notEmpty()
    .withMessage((value, { req }) => req.t("countInStockRequired"))
    .isInt({ min: 1, max: 255 })
    .withMessage((value, { req }) => req.t("countInStockRangeValidation")),

  // EN: price: required, number 1–10000 / TH: ต้องมี เป็นตัวเลข 1–10000
  body("price")
    .notEmpty()
    .withMessage((value, { req }) => req.t("priceRequired"))
    .isFloat({ min: 1, max: 10000 })
    .withMessage((value, { req }) => req.t("priceRangeValidation")),

  // EN: image: required, must be a URL / TH: ต้องมี และต้องเป็น URL
  body("image")
    .notEmpty()
    .withMessage((value, { req }) => req.t("imageRequired"))
    .isURL()
    .withMessage((value, { req }) => req.t("imageUrlValidation")),
];

/* ------------------------------------------------------------------
 * Update rules (PUT) — same rules, but every field is optional
 * กฎตอนแก้ไข (PUT) — กฎเหมือนเดิม แต่ไม่บังคับต้องส่งทุกฟิลด์
 * ------------------------------------------------------------------ */
const updateBookValidation = [
  body("bookName")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage((value, { req }) => req.t("bookNameLenghtValidation")),
  body("countInStock")
    .optional()
    .isInt({ min: 1, max: 255 })
    .withMessage((value, { req }) => req.t("countInStockRangeValidation")),
  body("price")
    .optional()
    .isFloat({ min: 1, max: 10000 })
    .withMessage((value, { req }) => req.t("priceRangeValidation")),
  body("image")
    .optional()
    .isURL()
    .withMessage((value, { req }) => req.t("imageUrlValidation")),
];

/* ------------------------------------------------------------------
 * :id rule — must be a valid MongoDB ObjectId (24 hex chars)
 * กฎของ :id — ต้องเป็น MongoDB ObjectId ที่ถูกต้อง (ตัวอักษรฐาน 16 จำนวน 24 ตัว)
 * ------------------------------------------------------------------ */
const idValidation = [
  param("id")
    .isMongoId()
    .withMessage((value, { req }) => req.t("bookIDValidation")),
];

/* ------------------------------------------------------------------
 * handleValidationErrors — put this AFTER the rules in a route.
 * EN: If any rule failed, reply 400 with the list of errors;
 *     otherwise call next() to continue to the route handler.
 * TH: ใส่ไว้ "หลัง" กฎใน route ถ้ามีกฎไหนไม่ผ่านจะตอบ 400 พร้อมรายการ error
 *     ถ้าผ่านทั้งหมดจะเรียก next() เพื่อไปทำงานต่อ
 * ------------------------------------------------------------------ */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  createBookValidation,
  updateBookValidation,
  handleValidationErrors,
  idValidation,
};
