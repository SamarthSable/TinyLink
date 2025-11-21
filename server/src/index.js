
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import the API routes
import linkRoutes from "./routes/linkRoutes.js"; 
// Import the specific redirect controller, as it needs to be mounted at the root level
import { redirectToTargetUrl } from "./controllers/linkController.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React frontend (client build)
const clientBuildPath = path.join(__dirname, "../dist"); // server/dist
app.use(express.static(clientBuildPath));

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// API Routes (Mounted under /api/links)
app.use("/api/links", linkRoutes);

// Redirect handler (The most crucial change: using the imported controller)
// This MUST be placed AFTER your API routes to prevent conflicts.
app.get("/:code", redirectToTargetUrl); 

// Catch-all route to serve React frontend for any unknown routes
app.all(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("Server running on port " + port));
  })
  .catch((err) => console.error("MongoDB connection error:", err));