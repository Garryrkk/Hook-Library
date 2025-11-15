import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint to confirm backend is connected
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
