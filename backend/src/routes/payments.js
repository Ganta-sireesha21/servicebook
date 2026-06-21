import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, (req, res) => {
  const payments = req.store.getPaymentsByUserId(req.user.id);
  res.json(payments);
});

router.post("/", authenticate, (req, res) => {
  const { bookingId, paymentMethod, transactionId, amount } = req.body;
  const payment = req.store.createPayment({ bookingId, paymentMethod, transactionId, amount });
  if (!payment) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.status(201).json(payment);
});

export default router;
