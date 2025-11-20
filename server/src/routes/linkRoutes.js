import express from "express";
import { createLink, getLinks, getLink, deleteLink } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", createLink);
router.get("/", getLinks);
router.get("/:code", getLink);
router.delete("/:code", deleteLink);

export default router;
