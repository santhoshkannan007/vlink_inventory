import connectDB from '../config/db.js';
import { exportPDF } from '../controllers/reportController.js';
import fs from 'fs';

const runDebug = async () => {
  await connectDB();
  
  const req = {
    query: {
      startDate: '',
      endDate: '',
      employee: 'All Employees',
      category: 'All Categories'
    }
  };

  const fileStream = fs.createWriteStream('test.pdf');

  const res = {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    write(chunk) {
      return fileStream.write(chunk);
    },
    end(chunk) {
      fileStream.end(chunk);
      console.log('PDF stream completed successfully!');
      process.exit(0);
    },
    status(code) {
      console.log('Status set to:', code);
      return this;
    },
    json(data) {
      console.error('Json error response:', data);
      process.exit(1);
    },
    // Writable stream compatibility
    on(event, callback) {
      fileStream.on(event, callback);
      return this;
    },
    once(event, callback) {
      fileStream.once(event, callback);
      return this;
    },
    emit(event, ...args) {
      fileStream.emit(event, ...args);
      return this;
    },
    removeListener(event, callback) {
      fileStream.removeListener(event, callback);
      return this;
    }
  };

  try {
    await exportPDF(req, res);
  } catch (err) {
    console.error('Unhandled throw:', err);
    process.exit(1);
  }
};

runDebug();
