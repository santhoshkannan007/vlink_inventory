import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['IN', 'OUT'], required: true },
  user: { type: String, required: true, default: 'System' }, // Person who performed the action
  date: { type: String, required: true },
  time: { type: String, required: true },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
