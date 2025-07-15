const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const { customLoggerMiddleware } = require("./middleware/customLogger");

dotenv.config();

const app = express();
app.use(express.json());
app.use(customLoggerMiddleware);
app.use("/", urlRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
