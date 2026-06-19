import Inventory from '../models/Inventory.js';
import Transaction from '../models/Transaction.js';

// Get all inventory items with status calculations (Reference image_2.png)
export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find({});
    
    // Dynamically flag thresholds on retrieval
    const processedItems = items.map(item => {
      let status = 'HEALTHY';
      if (item.currentStock <= 0) {
        status = 'OUT OF STOCK';
      } else if (item.currentStock <= item.minimumStock) {
        status = 'CRITICAL';
      }
      return { ...item._doc, status };
    });

    res.status(200).json({ success: true, data: processedItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Handle Stock In (Increment stock + generate transactional audit log)
export const processStockIn = async (req, res) => {
  try {
    const { itemId, quantity, supplier, invoice, receivedBy, date, time, remarks } = req.body;

    // Increment current stock atomically
    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      { $inc: { currentStock: quantity } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    // Write to unalterable transaction ledger
    await Transaction.create({
      item: itemId,
      quantity,
      type: 'IN',
      user: receivedBy,
      date,
      time,
      remarks: `Vendor: ${supplier} | Inv: ${invoice} | ${remarks}`
    });

    res.status(200).json({
      success: true,
      message: `${quantity} ${updatedItem.unit} added to ${updatedItem.itemName} successfully.`,
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Handle Stock Out (Decrement stock + generate transactional audit log)
export const processStockOut = async (req, res) => {
  try {
    const { itemId, quantity, employee, careOf, purpose, date, time, remarks } = req.body;

    // Decrement current stock atomically
    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      { $inc: { currentStock: -quantity } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    // Write to unalterable transaction ledger
    await Transaction.create({
      item: itemId,
      quantity,
      type: 'OUT',
      user: employee || careOf || 'System',
      date,
      time,
      remarks: `Purpose: ${purpose} | ${remarks || ''}`
    });

    res.status(200).json({
      success: true,
      message: `${quantity} ${updatedItem.unit} issued from ${updatedItem.itemName} successfully.`,
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get low stock alerts (flat array for header notifications)
export const getAlerts = async (req, res) => {
  try {
    const items = await Inventory.find({});
    const alerts = items.filter(item => item.currentStock <= item.minimumStock);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new inventory item
export const createInventoryItem = async (req, res) => {
  try {
    const { itemName, category, unit, currentStock, minimumStock, description } = req.body;

    const existing = await Inventory.findOne({ itemName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Item name already exists.' });
    }

    const newItem = await Inventory.create({
      itemName,
      category,
      unit: unit || 'Nos',
      currentStock: currentStock || 0,
      minimumStock: minimumStock || 0,
      description
    });

    // Write a system-level transaction log for auditing
    await Transaction.create({
      item: newItem._id,
      quantity: newItem.currentStock,
      type: 'IN',
      user: req.user?.name || 'System',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks: 'Initial catalog intake'
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an existing inventory item
export const updateInventoryItem = async (req, res) => {
  try {
    const { itemName, category, unit, currentStock, minimumStock, description } = req.body;
    const { id } = req.params;

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { itemName, category, unit, currentStock, minimumStock, description },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    // Delete related transactions to maintain clean history logs
    await Transaction.deleteMany({ item: id });

    res.status(200).json({ success: true, message: 'Inventory item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



