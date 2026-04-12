"use client";

import React, { useEffect, useState } from 'react';
import { Search, Mail, FileText, Ban, CheckCircle, ChevronDown } from 'lucide-react';
import { CustomerService } from '@/lib/CustomerService';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ gender: '', status: '', birthday: '', note: '' });
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await CustomerService.getCustomers(0, 500);
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(customer) {
    const currentActive = customer.address?.is_active !== false;
    try {
      await CustomerService.updateStatus(customer.customer_id, !currentActive);
      fetchData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  }

  function openNote(customer) {
    setNoteModal(customer);
    setNoteText(customer.address?.admin_note || '');
  }

  async function saveNote() {
    setSaving(true);
    try {
      await CustomerService.updateNote(noteModal.customer_id, noteText);
      setNoteModal(null);
      fetchData();
    } catch (err) {
      alert('Failed to save note: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = customers.filter(c => {
    const isActive = c.address?.is_active !== false;
    const note = c.address?.admin_note || '';
    const matchSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase());
    const matchGender = !filters.gender || (c.gender || '').toLowerCase() === filters.gender.toLowerCase();
    const matchStatus = !filters.status ||
      (filters.status === 'active' ? isActive : !isActive);
    const matchBirthday = !filters.birthday || (c.birthday || '').includes(filters.birthday);
    const matchNote = !filters.note ||
      (filters.note === 'has' ? !!note : !note);
    return matchSearch && matchGender && matchStatus && matchBirthday && matchNote;
  });

  const inputCls = "bg-slate-950 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 text-sm";

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-slate-400">View and manage your customer base.</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search name or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              className={`pl-9 w-56 ${inputCls}`} />
          </div>
          <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} className={inputCls}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={inputCls}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="stopped">Stopped</option>
          </select>
          <input type="text" placeholder="Birthday (e.g. 1990)" value={filters.birthday}
            onChange={e => setFilters(f => ({ ...f, birthday: e.target.value }))}
            className={`w-40 ${inputCls}`} />
          <select value={filters.note} onChange={e => setFilters(f => ({ ...f, note: e.target.value }))} className={inputCls}>
            <option value="">All Notes</option>
            <option value="has">Has Note</option>
            <option value="none">No Note</option>
          </select>
          {(search || filters.gender || filters.status || filters.birthday || filters.note) && (
            <button onClick={() => { setSearch(''); setFilters({ gender: '', status: '', birthday: '', note: '' }); }}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors">
              Clear
            </button>
          )}
          <span className="ml-auto text-xs text-slate-500 self-center">{filtered.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-800">
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Gender</th>
                <th className="py-4 px-6 font-medium">Birthday</th>
                <th className="py-4 px-6 font-medium">Note</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">No customers found.</td></tr>
              ) : (
                filtered.map((customer, idx) => {
                  const isActive = customer.address?.is_active !== false;
                  const note = customer.address?.admin_note;
                  return (
                    <tr key={customer.customer_id ?? idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors last:border-0">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {(customer.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{customer.name || '—'}</div>
                            {customer.is_admin && <div className="text-xs text-blue-400">Admin</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail size={14} />{customer.email || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 capitalize">{customer.gender || '—'}</td>
                      <td className="py-4 px-6 text-slate-300">{customer.birthday || '—'}</td>
                      <td className="py-4 px-6 text-slate-400 text-xs max-w-[150px] truncate">
                        {note || <span className="text-slate-600 italic">No note</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          {isActive ? 'Active' : 'Stopped'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openNote(customer)} title="Add/Edit Note"
                            className="text-slate-500 hover:text-blue-400 p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <FileText size={16} />
                          </button>
                          <button onClick={() => handleToggleStatus(customer)} title={isActive ? 'Stop Account' : 'Activate Account'}
                            className={`p-2 rounded-lg transition-colors ${isActive ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'}`}>
                            {isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-1">Admin Note</h2>
            <p className="text-slate-400 text-sm mb-4">Customer: {noteModal.name} ({noteModal.email})</p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4}
              placeholder="Write a note about this customer..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setNoteModal(null)} className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveNote} disabled={saving} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}