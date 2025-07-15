const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      location: String
    }
  ]
});

module.exports = mongoose.model("Url", urlSchema);
