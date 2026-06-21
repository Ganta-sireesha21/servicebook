import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const bookings = req.store.getBookingsByUserId(req.user.id);
  res.json(bookings);
});

router.post("/", authenticate, (req, res) => {
  const { serviceId, slotId } = req.body;
  const userId = req.user.id;

  const slotRecord = req.store.findSlotById(slotId);
  if (!slotRecord || slotRecord.slot.isBooked) {
    return res.status(400).json({ error: "Slot not available" });
  }

  const service = req.store.getServiceById(serviceId);
  if (!service) {
    return res.status(400).json({ error: "Service not found" });
  }

  const { booking, payment } = req.store.createBooking({ userId, serviceId, slotId });
  req.store.createNotification({ userId, message: `Booking confirmed for ${service.title} on ${new Date(slotRecord.slot.startTime).toLocaleString()}` });

  res.status(201).json({ ...booking, payment });
});

router.put("/:id", authenticate, (req, res) => {
  const booking = req.store.getBookingById(req.params.id);
  if (!booking || booking.user_id !== req.user.id) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const updated = req.store.updateBooking(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", authenticate, (req, res) => {
  const booking = req.store.getBookingById(req.params.id);
  if (!booking || booking.user_id !== req.user.id) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const cancelled = req.store.cancelBooking(req.params.id);
  req.store.createNotification({ userId: req.user.id, message: `Booking for ${booking.service_id} has been cancelled.` });
  res.json(cancelled);
});

export default router;
