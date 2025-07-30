const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Proxy for reverse geocoding
router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`,
      {
        headers: { "User-Agent": "MERN-Car-Rental-App/1.0" },
      }
    );
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from Nominatim" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&format=json&addressdetails=1&limit=8&dedupe=1`,
      { headers: { "User-Agent": "MERN-Car-Rental-App/1.0" } }
    );
    if (!response.ok)
      return res.status(500).json({ error: "Failed to fetch from Nominatim" });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
