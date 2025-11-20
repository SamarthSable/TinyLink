import Link from "../models/Link.js";
import { nanoid } from "nanoid";

export const createLink = async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url) return res.status(400).json({ error: "URL required" });

    // Use custom or generate code
    code = code || nanoid(6);

    // Check duplicate
    const exists = await Link.findOne({ code });
    if (exists) return res.status(409).json({ error: "Code already exists" });

    const link = await Link.create({ code, targetUrl: url });
    res.status(201).json(link);
  } catch (err) {
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
