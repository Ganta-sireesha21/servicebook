import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getNotifications } from '../controllers/notificationController.js';

const router = express.Router();
router.use(authenticateToken);
router.get('/', getNotifications);

export default router;
