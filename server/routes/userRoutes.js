import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user management routes are Admin-only
router.get('/', protect, authorize('Admin'), getUsers);
router.post('/', protect, authorize('Admin'), createUser);
router.put('/:id', protect, authorize('Admin'), updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

export default router;
