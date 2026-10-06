const express = require("express");
const BookModel = require("../models/book.model");
const {
  createBookValidation,
  updateBookValidation,
  handleValidationErrors,
  idValidation,
} = require("../validators/book.validator");

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
    const booklist = await BookModel.find();
    res.status(200).send(booklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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

router.put(
  "/:id",
  idValidation,
  updateBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBook = await BookModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
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
