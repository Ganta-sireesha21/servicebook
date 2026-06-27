import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createPaymentOrder, verifyPayment, getPayments } from '../controllers/paymentController.js';

const router = express.Router();
router.use(authenticateToken);
router.get('/', getPayments);
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
