/**
 * routes/book.routes.js — Book API endpoints / API ของหนังสือ (CRUD)
 *
 * EN: All paths here are mounted under /books (see index.js).
 * TH: ทุกเส้นทางในไฟล์นี้จะอยู่ใต้ /books (ดูใน index.js)
 *
 *   POST   /books       -> create a book       / เพิ่มหนังสือใหม่
 *   GET    /books       -> list all books      / ดูหนังสือทั้งหมด
 *   GET    /books/:id   -> get one book        / ดูหนังสือ 1 เล่มตาม id
 *   PUT    /books/:id   -> update a book       / แก้ไขหนังสือ
 *   DELETE /books/:id   -> delete a book       / ลบหนังสือ
 *
 * EN: Each route runs in order: validation rules -> handleValidationErrors -> handler.
 *     If validation fails, the handler is never reached (400 is returned).
 * TH: แต่ละ route ทำงานตามลำดับ: กฎตรวจสอบ -> handleValidationErrors -> โค้ดหลัก
 *     ถ้าข้อมูลไม่ผ่าน จะตอบกลับ 400 ทันทีโดยไม่เข้าโค้ดหลัก
 *
 * EN: req.t("key") returns a message in the request's language (locales/*.json).
 * TH: req.t("key") จะคืนข้อความตามภาษาของ request (จากไฟล์ locales/*.json)
 */
const express = require("express");
const BookModel = require("../models/book.model");
const {
  createBookValidation,
  updateBookValidation,
  handleValidationErrors,
  idValidation,
} = require("../validators/book.validator");

const router = express.Router();

/* ------------------------------------------------------------------
 * POST /books — Create a new book / เพิ่มหนังสือใหม่
 * Body: { bookName, countInStock, price, image }
 * Success: 201 + created book / สำเร็จ: 201 พร้อมข้อมูลหนังสือที่สร้าง
 * ------------------------------------------------------------------ */
router.post(
  "/",
  createBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

/* ------------------------------------------------------------------
 * GET /books — List all books / ดึงรายการหนังสือทั้งหมด
 * Success: 200 + array of books / สำเร็จ: 200 พร้อม array ของหนังสือ
 * ------------------------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const booklist = await BookModel.find();
    res.status(200).send(booklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ------------------------------------------------------------------
 * GET /books/:id — Get one book by id / ดึงหนังสือ 1 เล่มตาม id
 * 404 if not found / ถ้าไม่พบตอบ 404
 * ------------------------------------------------------------------ */
router.get("/:id", idValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: req.t("bookNotFound") });
    }

    res.status(200).send(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ------------------------------------------------------------------
 * DELETE /books/:id — Delete a book / ลบหนังสือ
 * 404 if not found / ถ้าไม่พบตอบ 404
 * ------------------------------------------------------------------ */
router.delete(
  "/:id",
  idValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleteBook = await BookModel.findByIdAndDelete(id);

      if (!deleteBook) {
        return res.status(404).json({ message: req.t("bookNotFound") });
      }

      res.status(200).json({ message: req.t("bookDeletedSuccessfully") });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

/* ------------------------------------------------------------------
 * PUT /books/:id — Update a book / แก้ไขหนังสือ
 * EN: Send only the fields you want to change.
 * TH: ส่งมาเฉพาะฟิลด์ที่ต้องการแก้ก็ได้
 * ------------------------------------------------------------------ */
router.put(
  "/:id",
  idValidation,
  updateBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBook = await BookModel.findByIdAndUpdate(id, req.body, {
        new: true, // EN: return the updated doc, not the old one / TH: คืนข้อมูลหลังแก้ ไม่ใช่ข้อมูลเก่า
        runValidators: true, // EN: apply schema rules on update too / TH: ให้ตรวจกฎใน schema ตอนแก้ไขด้วย
      });

      if (!updatedBook) {
        return res.status(404).json({ message: req.t("bookNotFound") });
      }

      res
        .status(200)
        .json({ message: req.t("bookUpdatedSuccessfully"), updatedBook });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

module.exports = router;
