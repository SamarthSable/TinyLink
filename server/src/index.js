import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import linkRoutes from "./routes/linkRoutes.js";
import Link from "./models/Link.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// API Routes
app.use("/api/links", linkRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, "./dist"))); // ./dist if dist is inside server/

// Redirect handler
app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const link = await Link.findOne({ code });

    if (!link) return res.status(404).send("Not found");

    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return res.redirect(302, link.targetUrl);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Catch-all route for React frontend
// Catch-all route for React frontend
// Safe way in Express 5
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});


// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("Server running on port " + port));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
