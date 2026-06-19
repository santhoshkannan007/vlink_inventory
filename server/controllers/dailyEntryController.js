import DailyEntry from '../models/DailyEntry.js';
import Inventory from '../models/Inventory.js';
import Transaction from '../models/Transaction.js';

export const createDailyEntry = async (req, res) => {
  try {
    const { date, time, careOf, quality, remarks, materials } = req.body;

    // 1. Save the Daily Entry Log
    const newEntry = new DailyEntry({
      date,
      time,
      careOf,
      quality,
      remarks,
      materials
    });
    
    await newEntry.save();

    // 2. Map frontend object keys to actual DB inventory names
    const materialMapping = {
      homeNode: 'Home Node',
      patchCode: 'Patch Code',
      tieWire: 'Tie Wire',
      plc1x4: 'PLC 1×4',
      plc1x8: 'PLC 1×8',
      stb: 'STB',
      modem: 'Modem',
      cable: 'Cable'
    };

    // 3. Process stock updates and write audit logs for each material provided
    for (const [key, qty] of Object.entries(materials)) {
      if (qty > 0) {
        const dbItemName = materialMapping[key];
        
        if (!dbItemName) continue;

        // Atomically decrement stock in Inventory
        const updatedItem = await Inventory.findOneAndUpdate(
          { itemName: dbItemName },
          { $inc: { currentStock: -qty } },
          { new: true }
        );

        if (updatedItem) {
          // Generate a permanent transaction record for the audit log
          await Transaction.create({
            item: updatedItem._id,
            quantity: qty,
            type: 'OUT',
            user: careOf, // Crediting the technician dispatching it
            date,
            time,
            remarks: `Automated deduction via Daily Entry log. Quality status: ${quality}`
          });
        }
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Daily Entry processed, stock levels updated automatically.',
      data: newEntry 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process dispatch log entry.', 
      error: error.message 
    });
  }
};
