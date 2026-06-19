const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const InventoryMaster = require('../models/InventoryMaster');
const Transaction = require('../models/Transaction');
const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const DailyEntry = require('../models/DailyEntry');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@vlink.com',
    password: 'admin123',
    role: 'Admin'
  },
  {
    name: 'Staff User',
    email: 'staff@vlink.com',
    password: 'staff123',
    role: 'Staff'
  }
];

const items = [
  {
    itemName: 'Home Node (FTTH)',
    sku: 'SKU-FTTH-012',
    category: 'Terminal Equipment',
    unit: 'Units',
    currentStock: 12,
    minimumStock: 50,
    description: 'Standard residential FTTH node, 4-port, 2.4GHz.'
  },
  {
    itemName: 'Patch Cord (Optical)',
    sku: 'SKU-CON-APC',
    category: 'Connectivity',
    unit: 'Meters',
    currentStock: 85,
    minimumStock: 100,
    description: 'Single mode SC-UPC to SC-APC 1.5m.'
  },
  {
    itemName: 'PLC Splitter 1x8',
    sku: 'SKU-SPL-108',
    category: 'Distribution',
    unit: 'Units',
    currentStock: 450,
    minimumStock: 150,
    description: 'Mini PLC splitter 1:8 ratio, G.657A1 fiber.'
  },
  {
    itemName: 'Modem (GPON)',
    sku: 'SKU-MOD-GPN',
    category: 'Terminal Equipment',
    unit: 'Units',
    currentStock: 1120,
    minimumStock: 200,
    description: 'Dual-band Wi-Fi 6 GPON ONT, Class B+.'
  },
  {
    itemName: 'Cable (Drop Cable)',
    sku: 'SKU-CAB-DRP',
    category: 'Infrastructure',
    unit: 'Drums',
    currentStock: 62,
    minimumStock: 15,
    description: '2 Core G.657A2 FRP Strength, LSZH Jacket.'
  },
  {
    itemName: 'Optical Fiber Closure',
    sku: 'SKU-OPT-FIB',
    category: 'Passive Gear',
    unit: 'Units',
    currentStock: 34,
    minimumStock: 20,
    description: 'Dome type, 48 fibers capacity, waterproof.'
  },
  {
    itemName: 'PLC Splitter 1x4',
    sku: 'SKU-SPL-104',
    category: 'Distribution',
    unit: 'Units',
    currentStock: 12,
    minimumStock: 30,
    description: 'Mini PLC splitter 1:4 ratio, G.657A1 fiber.'
  },
  {
    itemName: 'Tie Wire',
    sku: 'SKU-TIE-WIR',
    category: 'Infrastructure',
    unit: 'Meters',
    currentStock: 890,
    minimumStock: 200,
    description: 'Galvanized steel tie wire for overhead cables.'
  },
  {
    itemName: 'STB',
    sku: 'SKU-SET-TOP',
    category: 'Terminal Equipment',
    unit: 'Units',
    currentStock: 25,
    minimumStock: 10,
    description: '4K Android TV Set Top Box with remote.'
  },
  {
    itemName: 'Wall Outlet Box',
    sku: 'SKU-BOX-WL01',
    category: 'Passive Gear',
    unit: 'Units',
    currentStock: 15,
    minimumStock: 5,
    description: 'Indoor fiber wall socket faceplate.'
  }
];

const seedData = async () => {
  try {
    const { connectDB } = require('../config/db');
    await connectDB();

    // Clear existing
    await User.deleteMany();
    await InventoryMaster.deleteMany();
    await Transaction.deleteMany();
    await StockIn.deleteMany();
    await StockOut.deleteMany();
    await DailyEntry.deleteMany();

    console.log('Clearing database tables...');

    // Seed users
    const createdUsers = [];
    for (const u of users) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }
    console.log(`Seeded ${createdUsers.length} users successfully!`);

    // Seed inventory master
    const createdItems = await InventoryMaster.insertMany(items);
    console.log(`Seeded ${createdItems.length} inventory items successfully!`);

    // Let's create some initial transactions to populate the activity logs
    const adminUser = createdUsers.find(u => u.role === 'Admin');
    
    // Create stock in/out records to simulate history
    const homeNode = createdItems.find(i => i.itemName === 'Home Node (FTTH)');
    const patchCord = createdItems.find(i => i.itemName === 'Patch Cord (Optical)');
    const modemItem = createdItems.find(i => i.itemName === 'Modem (GPON)');
    const splitterItem = createdItems.find(i => i.itemName === 'PLC Splitter 1x4');
    const wallOutlet = createdItems.find(i => i.itemName === 'Wall Outlet Box');

    // Seed initial Transactions
    const initialTransactions = [
      {
        itemId: homeNode._id,
        quantity: 50,
        type: 'IN',
        user: adminUser._id,
        date: '2026-06-17',
        time: '10:00 AM',
        remarks: 'Bulk stock-in from supplier'
      },
      {
        itemId: patchCord._id,
        quantity: 120,
        type: 'IN',
        user: adminUser._id,
        date: '2026-06-17',
        time: '10:15 AM',
        remarks: 'Initial stock intake'
      },
      {
        itemId: modemItem._id,
        quantity: 25,
        type: 'IN',
        user: adminUser._id,
        date: '2026-06-17',
        time: '04:55 PM',
        remarks: 'Stock update'
      },
      {
        itemId: splitterItem._id,
        quantity: 12,
        type: 'OUT',
        user: adminUser._id,
        date: '2026-06-18',
        time: '09:12 AM',
        remarks: 'Daily Dispatch under careOf: J. Martinez'
      },
      {
        itemId: patchCord._id,
        quantity: 200,
        type: 'OUT',
        user: adminUser._id,
        date: '2026-06-17',
        time: '02:20 PM',
        remarks: 'Daily Dispatch under careOf: M. Chen'
      },
      {
        itemId: wallOutlet._id,
        quantity: 15,
        type: 'OUT',
        user: adminUser._id,
        date: '2026-06-17',
        time: '11:05 AM',
        remarks: 'Issued to employee: S. Thompson'
      }
    ];

    await Transaction.insertMany(initialTransactions);
    console.log('Seeded initial transactions.');

    // Seed some corresponding daily dispatch logs
    const dailyDispatches = [
      {
        date: '2026-06-18',
        time: '09:12 AM',
        careOf: 'J. Martinez',
        quality: 'GOOD',
        remarks: 'Sub-station maintenance routing dispatches',
        materials: [
          { itemId: splitterItem._id, quantity: 12 }
        ]
      },
      {
        date: '2026-06-17',
        time: '02:20 PM',
        careOf: 'M. Chen',
        quality: 'GOOD',
        remarks: 'Optic line connection repairs',
        materials: [
          { itemId: patchCord._id, quantity: 200 }
        ]
      }
    ];
    await DailyEntry.insertMany(dailyDispatches);

    // Seed stockout for Wall Outlet Box
    const stockOutLogs = [
      {
        itemId: wallOutlet._id,
        quantity: 15,
        employee: 'S. Thompson',
        careOf: 'S. Thompson',
        purpose: 'Office deployment',
        date: '2026-06-17',
        time: '11:05 AM',
        remarks: 'Issued to employee: S. Thompson'
      }
    ];
    await StockOut.insertMany(stockOutLogs);

    // Seed stockin for ONT GPON Terminal
    const stockInLogs = [
      {
        itemId: modemItem._id,
        quantity: 25,
        supplier: 'GPON Logistics Ltd',
        invoice: 'INV-ONT-9981',
        receivedBy: 'Admin',
        date: '2026-06-17',
        time: '04:55 PM',
        remarks: 'Received GPON Modems'
      }
    ];
    await StockIn.insertMany(stockInLogs);

    console.log('Seeding completed. Disconnecting...');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
