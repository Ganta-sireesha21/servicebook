import express from 'express';
import { getCurrentUser, updateCurrentUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);

export default router;
