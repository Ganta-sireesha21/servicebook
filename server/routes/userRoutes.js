import express from 'express';
import { getCurrentUser, updateCurrentUser, getAllUsers } from '../controllers/userController.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);
router.get('/', requireAdmin, getAllUsers);

export default router;
