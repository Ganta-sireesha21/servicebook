import express from 'express';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/my', getUserBookings);
router.delete('/:id', cancelBooking);

export default router;
