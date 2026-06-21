import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

router.post("/register", async (req, res) => {
  const { email, password, name, phone, profile_image } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existing = req.store.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = req.store.createUser({ email, password: hashed, name, phone, profile_image });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const user = req.store.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.get("/profile", authenticate, (req, res) => {
  const user = req.store.getUserProfile(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/profile", authenticate, (req, res) => {
  const { name, phone, profile_image } = req.body;
  const user = req.store.updateUserProfile(req.user.id, { name, phone, profile_image });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export default router;
