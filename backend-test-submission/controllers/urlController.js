const Url = require("../models/urlModel");
const { generateShortcode } = require("../utils/shortCodeGenerator");
require('../../logging-middleware/logger');

const createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) {
      await Log("backend", "error", "handler", "Missing URL in request");
      return res.status(400).json({ error: "URL is required" });
    }

    let shortCode = shortcode || generateShortcode();

    // Check if custom code exists
    const exists = await Url.findOne({ shortCode });
    if (exists) {
      await Log("backend", "warn", "handler", "Shortcode already exists");
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    const expiryDate = new Date(Date.now() + validity * 60000);

    const newUrl = new Url({
      originalUrl: url,
      shortCode,
      expiryDate
    });

    await newUrl.save();

    const shortLink = `http://localhost:${process.env.PORT}/${shortCode}`;

    res.status(201).json({
      shortLink,
      expiry: expiryDate.toISOString()
    });
  } catch (err) {
    await Log("backend", "fatal", "controller", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const redirectToLongUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      await Log("backend", "error", "handler", "Shortcode not found");
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (new Date() > urlDoc.expiryDate) {
      await Log("backend", "warn", "handler", "Shortcode expired");
      return res.status(410).json({ error: "Link expired" });
    }

    // Track click
    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.get("Referer") || "unknown",
      location: req.ip
    });

    await urlDoc.save();
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    await Log("backend", "error", "controller", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ error: "Shortcode not found" });
    }

    res.json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiryDate: urlDoc.expiryDate,
      totalClicks: urlDoc.clicks.length,
      clickDetails: urlDoc.clicks
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createShortUrl,
  redirectToLongUrl,
  getStats
};
