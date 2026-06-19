import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Database,
  ArrowDownCircle,
  ArrowUpCircle,
  ClipboardList,
  FileSpreadsheet,
  Users,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, role: 'All' },
    { id: 'inventory', name: 'Inventory Master', icon: Database, role: 'All' },
    { id: 'stock-in', name: 'Stock In', icon: ArrowDownCircle, role: 'All' },
    { id: 'stock-out', name: 'Stock Out', icon: ArrowUpCircle, role: 'All' },
    { id: 'daily-entry', name: 'Daily Entry', icon: ClipboardList, role: 'All' },
    { id: 'reports', name: 'Reports', icon: FileSpreadsheet, role: 'All' },
    { id: 'users', name: 'Users', icon: Users, role: 'Admin' },
    { id: 'settings', name: 'Settings', icon: Settings, role: 'All' }
  ];

  // Match the button color of the images:
  // image_0, image_1 (Dashboard, Daily Entry) -> Blue logout button (#1D4ED8)
  // image_2 (Inventory Master) -> Red logout button (#C53030)
  // image_3 (Reports) -> Muted dark logout button
  let logoutBtnColor = 'bg-[#1D4ED8] hover:bg-blue-700';
  if (activePage === 'inventory') {
    logoutBtnColor = 'bg-[#C53030] hover:bg-red-800';
  } else if (activePage === 'reports') {
    logoutBtnColor = 'bg-[#374151] hover:bg-gray-800';
  }

  return (
    <aside className="w-64 bg-[#111827] text-white flex flex-col justify-between flex-shrink-0 h-screen select-none no-print">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight text-white">VLink Networks</h1>
          <span className="text-[10px] text-gray-500 font-semibold tracking-widest block mt-0.5">Inventory Management System</span>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map(item => {
            // Check roles
            if (item.role === 'Admin' && user?.role !== 'Admin') {
              return null;
            }

            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${isActive
                  ? 'bg-gray-800 text-white border-l-4 border-blue-500 pl-3'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={() => setActivePage('settings')}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer text-left"
        >
          <HelpCircle className="h-5 w-5 text-gray-400" />
          Support
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${logoutBtnColor}`}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
