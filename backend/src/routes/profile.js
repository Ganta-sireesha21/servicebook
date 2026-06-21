import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const user = req.store.getUserProfile(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/", authenticate, (req, res) => {
  const { name, phone, profile_image } = req.body;
  const user = req.store.updateUserProfile(req.user.id, { name, phone, profile_image });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export default router;
