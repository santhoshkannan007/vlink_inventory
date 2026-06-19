const mongoose = require('mongoose');

const InventoryMasterSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryMaster', InventoryMasterSchema);
