import Link from "../models/Link.js";
import { nanoid } from "nanoid";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const createLink = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    let { code } = req.body;

    if (!code) {
      // Generate unique code
      let isUnique = false;
      while (!isUnique) {
        code = nanoid(6);
        const exists = await Link.findOne({ code });
        if (!exists) isUnique = true;
      }
    } else {
      // User-provided code must be unique
      const exists = await Link.findOne({ code });
      if (exists) return res.status(409).json({ error: "Code already exists" });
    }

    const link = await Link.create({ code, targetUrl: url });

    // Return full short URL
    res.status(201).json({ ...link.toObject(), shortUrl: `${BASE_URL}/${code}` });
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
