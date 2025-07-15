const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectToLongUrl,
  getStats
} = require("../controllers/urlController");

router.post("/shorturls", createShortUrl);
router.get("/shorturls/:shortCode", getStats);
router.get("/:shortCode", redirectToLongUrl);

module.exports = router;
