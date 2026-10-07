/**
 * models/book.model.js — Book data model / โมเดลข้อมูลหนังสือ
 *
 * EN: Defines what a "Book" document looks like in MongoDB (fields, types, rules).
 *     This is the LAST line of defense: even if a request skips the validator,
 *     Mongoose will still check these rules before saving.
 * TH: กำหนดโครงสร้างของเอกสาร "Book" ใน MongoDB (ฟิลด์, ชนิดข้อมูล, กฎ)
 *     เป็นด่านสุดท้ายก่อนบันทึก แม้ request จะหลุดจาก validator มาได้
 *     Mongoose ก็ยังตรวจกฎเหล่านี้อีกรอบ
 *
 * NOTE: Keep these limits in sync with validators/book.validator.js
 * หมายเหตุ: ค่าขอบเขตต่าง ๆ ต้องตรงกับใน validators/book.validator.js
 */
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  // EN: Book title, 5–200 characters. / TH: ชื่อหนังสือ ยาว 5–200 ตัวอักษร
  bookName: {
    type: String,
    required: [true, "Book name is required"],
    minlength: [5, "Book name must be at least 5 characters"],
    maxlength: [200, "Book name cannot exceed 200 characters"],
  },

  // EN: Number of copies in stock, 1–255. / TH: จำนวนหนังสือในสต็อก 1–255 เล่ม
  countInStock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [1, "Stock count cannot be less than 1"],
    max: [255, "Stock count cannot exceed 255"],
  },

  // EN: Price, 1–10,000. / TH: ราคา 1–10,000
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price cannot be less than 1"],
    max: [10000, "Price cannot exceed $10,000"],
  },

  // EN: Created date. Date.now (no brackets) = run at save time for each book.
  // TH: วันที่สร้าง ใช้ Date.now (ไม่มีวงเล็บ) เพื่อให้คำนวณเวลาใหม่ทุกครั้งที่บันทึก
  //     (ถ้าใส่ Date.now() ทุกเล่มจะได้เวลาเดียวกันคือเวลาที่เปิดเซิร์ฟเวอร์)
  dateCreated: {
    type: Date,
    default: Date.now,
  },

  // EN: Image URL (optional). Must start with http:// or https://
  // TH: ลิงก์รูปภาพ (ไม่บังคับ) ต้องขึ้นต้นด้วย http:// หรือ https://
  image: {
    type: String,
    default: "",
    validate: {
      validator: function (v) {
        if (!v) return true; // EN: empty is allowed / TH: ค่าว่างถือว่าผ่าน
        try {
          const url = new URL(v);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false; // EN: not a valid URL / TH: ไม่ใช่ URL ที่ถูกต้อง
        }
      },
      message: "Image must be a valid URL",
    },
  },
});

// EN: Add a virtual "id" field (string copy of _id) so clients can use book.id.
// TH: เพิ่มฟิลด์เสมือน "id" (คัดลอก _id เป็นข้อความ) ให้ฝั่ง client ใช้ book.id ได้สะดวก
bookSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// EN: Include virtual fields (like "id") when converting to JSON for responses.
// TH: ให้ฟิลด์เสมือน (เช่น "id") ติดไปด้วยตอนแปลงเป็น JSON ส่งกลับ
bookSchema.set("toJSON", {
  virtuals: true,
});

// EN: "Book" model -> stored in the "books" collection.
// TH: โมเดล "Book" -> เก็บใน collection ชื่อ "books"
module.exports = mongoose.model("Book", bookSchema);
