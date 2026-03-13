"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Mail, Plus, Edit2, Trash2, Save } from 'lucide-react';
// 1. Import the new service
import { CustomerService } from '@/lib/CustomerService';
import { Modal } from '@/components/Modal/Modal';
import { totalSpend,totalOrder } from '@/lib/utils/dashboardCalculations';


 

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order,setOrder]= useState([]);
  const [spend,setSpend]= useState([]);

  

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      status: 'Active',
      spent: '$0.00',
      orders: 0,
      avatar: 'NewUser'
  });

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'cancelled':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

  const fetchData = async () => {
    try {
      setLoading(true);
      // 2. Use the new service here
      const data = await CustomerService.getCustomers(0,500); 
       const totalOrders= totalOrder(data);
       const totalSpends = totalSpend(data);
      setCustomers(data);
      setOrder(totalOrders);
      setSpend(totalSpends);
    
      
    } catch (error) {
      console.error("Failed to load customers", error);
      // Optional: Add toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
      setEditingCustomer(null);
      setFormData({
          name: '',
          email: '',
          status: 'Active',
          spent: '$0.00',
          orders: 0,
          avatar: `User${Math.floor(Math.random() * 100)}`
      });
      setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
      setEditingCustomer(customer);
      setFormData(customer);
      setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this customer?')) {
          // 3. Update delete logic
          await CustomerService.deleteCustomer(id);
          fetchData();
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      // 4. Update submit logic
      if (editingCustomer) {
          await CustomerService.updateCustomer(editingCustomer.id, formData);
      } else {
          await CustomerService.addCustomer({ ...formData, lastActive: 'Just now' });
      }
      setIsModalOpen(false);
      fetchData();
  };

  return (
    <div className="space-y-6">
       {/* ... (Rest of your JSX remains exactly the same) ... */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400">Manage and view your customer base.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                <Filter size={18} />
                <span>Filter</span>
            </button>
            <button 
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center gap-2"
            >
                <Plus size={18} />
                Add Customer
            </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Table Search */}
        <div className="p-4 border-b border-slate-800">
             <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search customers..." 
                    className="w-full bg-slate-950 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-800">
                        <th className="py-4 px-6 font-medium">Customer</th>
                        <th className="py-4 px-6 font-medium">Contact</th>
                        <th className="py-4 px-6 font-medium">Orders</th>
                        <th className="py-4 px-6 font-medium">Total Spent</th>
                        <th className="py-4 px-6 font-medium">Status</th>
                        <th className="py-4 px-6 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
  {loading ? (
    <tr>
      <td colSpan={6} className="py-8 text-center text-slate-500">
        Loading...
      </td>
    </tr>
  ) : (
    customers.map((customer, idx) => (
      <tr
        key={customer.id ?? customer._id ?? `${customer.email ?? "no-email"}-${idx}`}
        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors last:border-0"
      >
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.avatar}`}
              alt={customer.id}
              className="w-10 h-10 rounded-full bg-slate-700"
            />
            <div>
              <div className="font-medium text-white">{customer.username}</div>
              <div className="text-xs text-slate-400">{customer.lastActive}</div>
            </div>
          </div>
        </td>

        <td className="py-4 px-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail size={14} />
            {customer.Email}
          </div>
        </td>

        <td className="py-4 px-6 text-slate-300">{customer.ordersCount}</td>
        <td className="py-4 px-6 font-medium text-white">{customer.email}</td>

        <td className="py-3 md:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(customer.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          customer.status === 'Completed' ? 'bg-emerald-400' : 
                          customer.status === 'Pending' ? 'bg-amber-400' : 'bg-rose-400'
                        }`}></span>
                        {customer.status}
                      </span>
                    </td>

        <td className="py-4 px-6 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleOpenEdit(customer)}
              className="text-slate-500 hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(customer.id ?? customer._id)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
        </div>
      </div>

       {/* Customer Modal - Keep existing JSX */}
       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
      >
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input 
                      type="text" 
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input 
                      type="email" 
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Total Spent</label>
                      <input 
                          type="text" 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          value={formData.spent}
                          onChange={e => setFormData({...formData, spent: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                      <select 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                          <option>Active</option>
                          <option>Inactive</option>
                      </select>
                  </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                  <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                      <Save size={18} />
                      Save
                  </button>
              </div>
          </form>
      </Modal>
    </div>
  );
}