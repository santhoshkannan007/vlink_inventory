import express from 'express';
import { getReportSummary, exportExcel, exportPDF } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, authorize('Admin'), getReportSummary);
router.get('/excel', protect, authorize('Admin'), exportExcel);
router.get('/pdf', protect, authorize('Admin'), exportPDF);

export default router;
