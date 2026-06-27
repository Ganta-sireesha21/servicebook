import express from 'express';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  updateBooking,
  getAllBookings,
  adminActionOnBooking,
  getBookingById
} from '../controllers/bookingController.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/my', getUserBookings);
router.get('/', requireAdmin, getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', cancelBooking);
router.post('/:id/action', requireAdmin, adminActionOnBooking);

export default router;
