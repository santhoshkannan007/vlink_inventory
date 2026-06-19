import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit3, Trash2, Shield, ShieldAlert, Mail, User, Lock } from 'lucide-react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError('Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({ name: '', email: '', password: '', role: 'Staff' });
    setModalMode('add');
    setCurrentUserId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setModalMode('edit');
    setCurrentUserId(user._id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await axios.delete(`/api/users/${userId}`);
      if (res.data.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete this user.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        if (!formData.password) {
          setFormError('Password is required for new accounts.');
          setSubmitting(false);
          return;
        }
        const res = await axios.post('/api/users', formData);
        if (res.data.success) {
          await fetchUsers();
          setIsModalOpen(false);
        }
      } else {
        const payload = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password.trim() !== '') {
          payload.password = formData.password;
        }
        const res = await axios.put(`/api/users/${currentUserId}`, payload);
        if (res.data.success) {
          await fetchUsers();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 font-medium text-slate-500 font-sans">Loading user accounts directory...</div>;
  if (error) return <div className="text-rose-600 font-semibold p-4 bg-rose-50 rounded-xl border border-rose-200 font-sans">{error}</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage system accounts, roles, and access credentials.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add New User
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><UsersIcon className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Accounts</p>
            <p className="text-xl font-extrabold font-mono text-slate-900 mt-0.5">{users.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><Shield className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Admins</p>
            <p className="text-xl font-extrabold font-mono text-slate-900 mt-0.5">{users.filter(u => u.role === 'Admin').length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><User className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Staff Members</p>
            <p className="text-xl font-extrabold font-mono text-slate-900 mt-0.5">{users.filter(u => u.role === 'Staff').length}</p>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-6 text-slate-600">Name</th>
                <th className="py-3 px-6 text-slate-600">Email</th>
                <th className="py-3 px-6 text-center text-slate-600">Role</th>
                <th className="py-3 px-6 text-slate-600">Created</th>
                <th className="py-3 px-6 text-center text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[11px] shadow-inner shrink-0">
                        {u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono tracking-wide border ${
                      u.role === 'Admin'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {u.role === 'Admin' ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-400 font-mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">No user accounts registered in the system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === 'add' ? 'Register New User' : 'Edit User Account'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-lg text-xs text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-3.5 w-3.5 text-slate-400" /></span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-3.5 w-3.5 text-slate-400" /></span>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                    placeholder="e.g. user@vlink.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {modalMode === 'add' ? 'Password *' : 'New Password (leave blank to keep current)'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-3.5 w-3.5 text-slate-400" /></span>
                  <input
                    type="password"
                    required={modalMode === 'add'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                >
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Account' : 'Update Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
