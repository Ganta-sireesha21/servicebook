import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const notifications = req.store.getNotificationsByUserId(req.user.id);
  res.json(notifications);
});

router.put("/:id/read", authenticate, (req, res) => {
  const notification = req.store.markNotificationRead(req.user.id, req.params.id);
  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }
  res.json(notification);
});

export default router;
