import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, User } from 'lucide-react';
import axios from 'axios';

const Header = ({ onSearchChange, searchTerm }) => {
  const { user } = useContext(AuthContext);
  const [alertsCount, setAlertsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('/api/inventory/alerts');
        setAlertsCount(res.data.length);
        setNotifications(res.data.map(item => ({
          id: item._id,
          message: `${item.itemName} is low in stock (${item.currentStock} ${item.unit} remaining)`
        })));
      } catch (err) {
        console.error('Failed to load header alerts', err);
      }
    };
    if (user) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Determine user role subtitle
  const getRoleSubtitle = () => {
    if (user?.role === 'Admin') return 'Systems Engineer';
    return 'Operations Staff';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 select-none flex-shrink-0 no-print">
      {/* Search Input */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search inventory, SKU, or user..."
          value={searchTerm || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full bg-[#F9FAFB] pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative cursor-pointer"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {alertsCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center animate-pulse">
                {alertsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-xs text-gray-700">System Alarms</span>
                <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                  {alertsCount} Active
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    All stock levels healthy.
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div key={idx} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-2">
                      <span className="text-red-500 font-bold">⚠️</span>
                      <span className="text-xs text-gray-600 font-medium">{n.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-sm font-bold text-gray-800 leading-tight">
              {user?.name || 'Loading...'}
            </span>
            <span className="block text-[11px] text-gray-500 font-medium leading-none mt-0.5">
              {getRoleSubtitle()}
            </span>
          </div>

          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
