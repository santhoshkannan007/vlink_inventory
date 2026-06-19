import express from 'express';
import { createDailyEntry } from '../controllers/dailyEntryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST route matching frontend submission endpoint - Protected
router.post('/', protect, createDailyEntry);

export default router;
