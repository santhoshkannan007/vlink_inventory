import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// Any authenticated worker can view their dashboard context stats
router.get('/stats', protect, getDashboardStats);

export default router;
