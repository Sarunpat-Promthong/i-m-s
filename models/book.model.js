const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  bookName: {
    type: String,
    required: [true, "Book name is required"],
    minlength: [5, "Book name must be at least 5 characters"],
    maxlength: [100, "Book name cannot exceed 100 characters"],
  },
  countInStock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [1, "Stock count cannot be less than 1"],
    max: [255, "Stock count cannot exceed 2555"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price Cannot be negative"],
    max: [10000, "Price cannot exceed $10,000"],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    default: "",
    validate: {
      validator: function (v) {
        if (!v) return true;
        try {
          const url = new URL(v);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      message: "Image must be a valid URL",
    },
  },
});

bookSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

bookSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Book", bookSchema);
