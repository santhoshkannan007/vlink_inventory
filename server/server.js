import dotenv from 'dotenv';
dotenv.config(); // ◄ MUST BE LINE 2, BEFORE ALL OTHER IMPORTS

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dailyEntryRoutes from './routes/dailyEntryRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import Inventory from './models/Inventory.js';
import Technician from './models/Technician.js';
import User from './models/User.js';

// Initialize DB Connection
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || '*'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Auto-seed default materials and users if empty
const seedDefaultData = async () => {
  try {
    const itemCount = await Inventory.countDocuments();
    if (itemCount === 0) {
      console.log('🌱 Database is empty. Seeding default telecom inventory items...');
      const defaultItems = [
        { itemName: 'Home Node', category: 'Terminal Equipment', unit: 'Units', currentStock: 42, minimumStock: 50, description: 'Standard residential FTTH node.' },
        { itemName: 'Patch Code', category: 'Connectivity', unit: 'Meters', currentStock: 156, minimumStock: 100, description: 'Fiber Patch Cord.' },
        { itemName: 'Tie Wire', category: 'Infrastructure', unit: 'Meters', currentStock: 890, minimumStock: 200, description: 'Galvanized steel tie wire.' },
        { itemName: 'PLC 1×4', category: 'Distribution', unit: 'Units', currentStock: 12, minimumStock: 30, description: '1x4 PLC Splitter.' },
        { itemName: 'PLC 1×8', category: 'Distribution', unit: 'Units', currentStock: 8, minimumStock: 15, description: '1x8 PLC Splitter.' },
        { itemName: 'STB', category: 'Terminal Equipment', unit: 'Units', currentStock: 25, minimumStock: 10, description: 'Set Top Box.' },
        { itemName: 'Modem', category: 'Terminal Equipment', unit: 'Units', currentStock: 11, minimumStock: 20, description: 'GPON Modem.' },
        { itemName: 'Cable', category: 'Infrastructure', unit: 'Meters', currentStock: 2400, minimumStock: 500, description: 'Fiber drop cable.' }
      ];
      await Inventory.insertMany(defaultItems);
      console.log('✅ Materials seeding completed.');
    }

    // Seed default technicians if empty
    const techCount = await Technician.countDocuments();
    if (techCount === 0) {
      console.log('🌱 Seeding default technicians...');
      const defaultTechs = [
        { name: 'Rajesh Kuruvi', phone: '' },
        { name: 'Gautham HPC', phone: '' },
        { name: 'Murugeshan Vlink', phone: '' },
        { name: 'New Staff', phone: '' },
        { name: 'Lekshmanan Vlink', phone: '' }
      ];
      await Technician.insertMany(defaultTechs);
      console.log('✅ Technicians seeding completed.');
    }
  } catch (err) {
    console.error('Auto-seeding error:', err.message);
  }
};
seedDefaultData();

// Main App API Mounts
app.use('/api/auth', authRoutes);
app.use('/api/daily-entries', dailyEntryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/technicians', technicianRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'VLink Systems Engine is healthy.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 System API routing running on port ${PORT}`);
});

