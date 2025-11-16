import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());   

// ===============================================
// SCRAPER ROUTES
// ===============================================

// Reddit scrape route
app.get("/scrape/reddit", async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Reddit scraper working!",
      data: { example: "Sample Reddit data" }
    });
  } catch (err) {
    res.status(500).json({ error: "Reddit scraper failed" });
  }
});

// Instagram scrape route
app.get("/scrape/instagram", async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Instagram scraper working!",
      data: { example: "Sample Instagram data" }
    });
  } catch (err) {
    res.status(500).json({ error: "Instagram scraper failed" });
  }
});

// YouTube scrape route
app.get("/scrape/youtube", async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "YouTube scraper working!",
      data: { example: "Sample YouTube data" }
    });
  } catch (err) {
    res.status(500).json({ error: "YouTube scraper failed" });
  }
});

// ===============================================
// TEST ROUTES
// ===============================================

// Quick test endpoint
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend is connected!" });
});

// Example POST endpoint
app.post("/api/data", (req, res) => {
  res.json({
    received: req.body,
    status: "OK",
  });
});

// ===============================================
// SERVER START
// ===============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
