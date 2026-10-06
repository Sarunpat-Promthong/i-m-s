const express = require("express");
const i18next = require("i18next");
const backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const bookRouter = require("./routes/book.routes");

i18next
  .use(backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "locales/{{lng}}.json",
    },
  });

app.use(middleware.handle(i18next));
app.use(express.json());
app.use("/books", bookRouter);

app.listen(port, () => {
  console.log(`App Listing on Port  ${port}`);
});

mongoose
  .connect(process.env.CONNECT_STRING)
  .then(() => console.log("Connected to Mongo DB"))
  .catch((error) => console.log(error));
