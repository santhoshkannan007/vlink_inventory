import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Technician', technicianSchema);
