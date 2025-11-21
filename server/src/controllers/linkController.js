


import Link from "../models/Link.js";
import { nanoid } from "nanoid";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// NEW CONTROLLER: Handles redirection and click tracking
export const redirectToTargetUrl = async (req, res) => {
  try {
    const code = req.params.code;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).send("Tiny link not found.");
    }

    // 1. Increment clicks and update last clicked time (saved to DB)
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save(); // Persist the click count change

    // 2. Perform the redirect
    return res.redirect(302, link.targetUrl);
  } catch (e) {
    console.error("Redirection error:", e);
    res.status(500).send("Server error during link resolution.");
  }
};


export const createLink = async (req, res) => {
  try {
    const { url, code: userCode } = req.body;

    if (!url || url.trim() === "") {
      return res.status(400).json({ error: "URL required" });
    }

    let code;

    if (userCode && userCode.trim() !== "") {
      // User provided a custom code
      const exists = await Link.findOne({ code: userCode });
      if (exists) return res.status(409).json({ error: "backend called" });
      code = userCode.trim();
    } else {
      // Generate unique code automatically
      let isUnique = false;
      while (!isUnique) {
        code = nanoid(6);
        const exists = await Link.findOne({ code });
        if (!exists) isUnique = true;
      }
    }

    const link = await Link.create({ code, targetUrl: url.trim() });

    res.status(201).json({
      ...link.toObject(),
      shortUrl: `${BASE_URL}/${code}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLinks = async (req, res) => {
  const links = await Link.find().sort({ createdAt: -1 });
  res.json(links);
};

export const getLink = async (req, res) => {
  const { code } = req.params;
  const link = await Link.findOne({ code });
  if (!link) return res.status(404).json({ error: "Not found" });
  res.json(link);
};

export const deleteLink = async (req, res) => {
  const { code } = req.params;
  const link = await Link.findOneAndDelete({ code });
  if (!link) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};