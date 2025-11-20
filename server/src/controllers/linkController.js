import Link from "../models/Link.js";
import { nanoid } from "nanoid";

export const createLink = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    let { code } = req.body;

    if (!code) {
      // Keep generating until a unique code is found
      let isUnique = false;
      while (!isUnique) {
        code = nanoid(6);
        const exists = await Link.findOne({ code });
        if (!exists) isUnique = true;
      }
    } else {
      // If user provides code, check uniqueness
      const exists = await Link.findOne({ code });
      if (exists) return res.status(409).json({ error: "Code already exists" });
    }

    const link = await Link.create({ code, targetUrl: url });
    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
