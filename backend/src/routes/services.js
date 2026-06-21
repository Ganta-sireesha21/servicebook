import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(req.store.services);
});

router.get("/:id", (req, res) => {
  const service = req.store.getServiceById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
});

router.post("/", authenticate, (req, res) => {
  const { title, description, category, duration, price, image_url, status, availableSlots } = req.body;
  const service = req.store.createService({
    provider_id: req.user.id,
    title,
    description,
    category,
    duration,
    price,
    image_url,
    status,
    availableSlots,
  });
  res.status(201).json(service);
});

router.put("/:id", authenticate, (req, res) => {
  const updates = req.body;
  const service = req.store.getServiceById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  if (service.provider_id !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const updated = req.store.updateService(req.params.id, updates);
  res.json(updated);
});

router.delete("/:id", authenticate, (req, res) => {
  const service = req.store.getServiceById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  if (service.provider_id !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  req.store.deleteService(req.params.id);
  res.status(204).end();
});

export default router;
