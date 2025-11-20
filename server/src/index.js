import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import linkRoutes from "./routes/linkRoutes.js";
import Link from "./models/Link.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// All API Routes
app.use("/api/links", linkRoutes);

// Redirect Handler
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
    res.status(500).json({ error: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server running on port " + process.env.PORT)
    );
  })
  .catch((err) => console.error(err));
