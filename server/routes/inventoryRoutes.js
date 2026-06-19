import express from 'express';
import { 
  getInventory, 
  processStockIn, 
  processStockOut, 
  getAlerts,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// View inventory catalog items
router.get('/', protect, getInventory);

// Create, Update, Delete inventory catalog items (Allowed for both Admin and Staff)
router.post('/', protect, createInventoryItem);
router.put('/:id', protect, updateInventoryItem);
router.delete('/:id', protect, deleteInventoryItem);

// ONLY Admins can process bulk Stock In vendor entries
router.post('/stock-in', protect, authorize('Admin'), processStockIn);

// Both Admin and Staff can process stock out and view alerts
router.get('/alerts', protect, getAlerts);
router.post('/stock-out', protect, processStockOut);

export default router;
