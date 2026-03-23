'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/Navbar/AuthContext';
import ForecastWidget from '@/components/Admin/ForecastWidget';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trainMsg, setTrainMsg] = useState(null);
  const [trainMsgType, setTrainMsgType] = useState('success');

  useEffect(() => {
    if (user?.isAdmin) loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

  const handleUpdateData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8008/data/update', { method: 'POST' });
      const result = await response.json();
      alert(result.message || 'Dataset updated successfully');
    } catch (error) {
      alert('Error updating data: ' + error.message);
    }
    setLoading(false);
  };

  const handleTrainAllModels = async () => {
    setLoading(true);
    setTrainMsg(null);
    try {
      const productIds = products.map(p => p.id);
      const response = await fetch('/api/forecast/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds, force_retrain: true }),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setTrainMsgType('success');
      setTrainMsg(result.message || 'Training started for all products');
    } catch (error) {
      setTrainMsgType('error');
      setTrainMsg('Error: ' + error.message);
    }
    setLoading(false);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'forecast', name: 'Forecasting', icon: '🔮' },
    { id: 'models', name: 'Models', icon: '🤖' },
    { id: 'data', name: 'Data', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">MLOps Forecasting System Management</p>
            </div>
            <a href="http://localhost:8008/docs" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
              API Docs
            </a>
          </div>
          <div className="mt-6 flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <span className="mr-2">{tab.icon}</span>{tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {activeTab === 'overview' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecasting Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-700">Daily</div>
                      <div className="text-gray-600 text-sm">Short-term predictions</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-purple-700">Weekly</div>
                      <div className="text-gray-600 text-sm">Mid-term analysis</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">Monthly</div>
                      <div className="text-gray-600 text-sm">Long-term planning</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h3>
                  <ForecastWidget productId={products[0]?.id} period="week" />
                </div>
              </>
            )}

            {activeTab === 'forecast' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Sales Forecast</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Select a product and period to forecast its future sales quantity.
                  Train models first if you haven't already.
                </p>
                <ForecastWidget products={products} />
              </div>
            )}

            {activeTab === 'models' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Training</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Train forecasting models on the full dataset combining orders, payments, products and customers.
                  Training runs in the background — check MLflow for experiment results.
                </p>

                {trainMsg && (
                  <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                    trainMsgType === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {trainMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="font-medium text-gray-900 mb-1">Training Dataset</div>
                    <div className="text-sm text-gray-500">
                      Orders + Payments + Products + Customers — {products.length} products loaded
                    </div>
                  </div>

                  <button
                    onClick={handleTrainAllModels}
                    disabled={loading || products.length === 0}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Training in progress...
                      </>
                    ) : (
                      `🤖 Train Models on Full Dataset (${products.length} products)`
                    )}
                  </button>

                  <div className="flex gap-3">
                    <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-xl transition">
                      📊 MLflow Tracking
                    </a>
                    <a href="http://localhost:8008/docs" target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition">
                      📖 Forecast API
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <button onClick={handleUpdateData} disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                      {loading ? 'Updating...' : 'Update Dataset from Services'}
                    </button>
                    <p className="text-sm text-gray-500">
                      Fetches latest orders, payments and products data and saves as training dataset.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">View Data Sources</h4>
                    <div className="space-y-3">
                      {[
                        { href: 'http://localhost:8000/products/', icon: '🛍️', label: 'Product Service', desc: 'View all products', color: 'blue' },
                        { href: 'http://localhost:8003/orders/', icon: '📦', label: 'Order Service', desc: 'View all orders', color: 'green' },
                        { href: 'http://localhost:8002/payments/', icon: '💳', label: 'Payment Service', desc: 'View all payments', color: 'purple' },
                        { href: 'http://localhost:8004/docs', icon: '👤', label: 'Login Service', desc: 'View customers', color: 'orange' },
                      ].map(({ href, icon, label, desc, color }) => (
                        <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                          className={`block px-4 py-3 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition flex items-center gap-3`}>
                          <span>{icon}</span>
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-gray-500">{desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Available Products</div>
                  <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Service Status</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { tab: 'models', icon: '🤖', label: 'Train Models', desc: 'Update AI predictions' },
                  { tab: 'forecast', icon: '🔮', label: 'Generate Forecast', desc: 'Predict product sales' },
                  { tab: 'data', icon: '📈', label: 'Update Data', desc: 'Fetch latest sales' },
                ].map(({ tab, icon, label, desc }) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3">
                    <span>{icon}</span>
                    <div><div className="font-medium">{label}</div><div className="text-sm text-gray-500">{desc}</div></div>
                  </button>
                ))}
                {[
                  { href: 'http://localhost:5000', icon: '📊', label: 'MLflow Tracking', desc: 'Model experiments' },
                  { href: 'http://localhost:9090', icon: '📊', label: 'Prometheus', desc: 'View metrics' },
                  { href: 'http://localhost:13000', icon: '📈', label: 'Grafana', desc: 'Analytics dashboard' },
                ].map(({ href, icon, label, desc }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3">
                    <span>{icon}</span>
                    <div><div className="font-medium">{label}</div><div className="text-sm text-gray-500">{desc}</div></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}