import express from 'express';
import { getTechnicians, createTechnician, updateTechnician, deleteTechnician } from '../controllers/technicianController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Any authenticated user can view the list
router.get('/', protect, getTechnicians);

// Only Admin can create, update, delete
router.post('/', protect, authorize('Admin'), createTechnician);
router.put('/:id', protect, authorize('Admin'), updateTechnician);
router.delete('/:id', protect, authorize('Admin'), deleteTechnician);

export default router;
