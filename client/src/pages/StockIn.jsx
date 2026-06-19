import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowDownLeft, FileSpreadsheet, ClipboardList } from 'lucide-react';
import axios from 'axios';

export default function StockIn() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [invoice, setInvoice] = useState('');
  const [remarks, setRemarks] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/inventory');
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch inventory catalog.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();

    // Default date/time
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().split(' ')[0].substring(0, 5));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!itemId) {
      setError('Please select an item to restock.');
      return;
    }

    try {
      const response = await axios.post('/api/inventory/stock-in', {
        itemId,
        quantity: Number(quantity),
        supplier,
        invoice,
        receivedBy: user?.name || 'Admin',
        date,
        time,
        remarks
      });

      if (response.data.success) {
        setSuccess(`Successfully logged stock arrival! ${quantity} units added.`);
        // Reset form except defaults
        setItemId('');
        setQuantity('');
        setSupplier('');
        setInvoice('');
        setRemarks('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit stock arrival.');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500 font-sans">Loading stock options...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Stock In</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Register truck arrivals, supplier shipments, and log items to warehouse.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg text-xs font-semibold text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg text-xs font-semibold text-emerald-700">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          Shipment Specifications
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Catalog Item</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="">-- Choose Item --</option>
              {items.map(i => (
                <option key={i._id} value={i._id}>{i.itemName} ({i.unit}) - Stock: {i.currentStock}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quantity Received</label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Supplier / Vendor Name</label>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. FiberTech Solutions"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Invoice / Challan Reference</label>
            <input
              type="text"
              required
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="e.g. INV-2026-987"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Arrival Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Arrival Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Remarks / Details</label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Log comments about quality check, delivery truck no, etc."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-3 focus:outline-none focus:border-blue-500 focus:bg-white"
          ></textarea>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-100 flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Commit Stock In
          </button>
        </div>
      </form>
    </div>
  );
}
