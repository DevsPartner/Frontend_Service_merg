'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/Navbar/AuthContext';
import ForecastWidget from '@/components/Admin/ForecastWidget';
import ModelTraining from '@/components/Admin/ModelTraining';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
  };

  const handleUpdateData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8008/data/update', {
        method: 'POST',
      });
      const result = await response.json();
      alert(result.message || 'Dataset updated successfully');
    } catch (error) {
      alert('Error updating data: ' + error.message);
    }
    setLoading(false);
  };

  const handleTrainModel = async (productIds = [101, 102, 103]) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8008/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_ids: productIds,
          force_retrain: true,
        }),
      });
      const result = await response.json();
      alert(result.message || 'Training started successfully');
    } catch (error) {
      alert('Error training model: ' + error.message);
    }
    setLoading(false);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
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
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">MLOps Forecasting System Management</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:8008/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API Docs
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Forecast</h3>
                <ForecastWidget products={products} />
              </div>
            )}

            {activeTab === 'models' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Management</h3>
                <ModelTraining products={products} />
              </div>
            )}

            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleUpdateData}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Dataset Now'}
                    </button>
                    <p className="text-sm text-gray-500">
                      Fetch latest data from all services
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">View Data Sources</h4>
                    <div className="space-y-3">
                      <a
                        href="http://localhost:8000/products"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-3"
                      >
                        <span className="text-blue-600">🛍️</span>
                        <div>
                          <div className="font-medium">Product Service</div>
                          <div className="text-sm text-gray-500">View all products</div>
                        </div>
                      </a>
                      
                      <a
                        href="http://localhost:8003/orders"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center gap-3"
                      >
                        <span className="text-green-600">📦</span>
                        <div>
                          <div className="font-medium">Order Service</div>
                          <div className="text-sm text-gray-500">View all orders</div>
                        </div>
                      </a>
                      
                      <a
                        href="http://localhost:8002/payments"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center gap-3"
                      >
                        <span className="text-purple-600">💳</span>
                        <div>
                          <div className="font-medium">Payment Service</div>
                          <div className="text-sm text-gray-500">View all payments</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
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

            {/* Quick Actions - Now includes all monitoring links */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('models')}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-blue-600">🤖</span>
                  <div>
                    <div className="font-medium">Train New Models</div>
                    <div className="text-sm text-gray-500">Update AI predictions</div>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveTab('data')}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-purple-600">📈</span>
                  <div>
                    <div className="font-medium">Update Data</div>
                    <div className="text-sm text-gray-500">Fetch latest sales</div>
                  </div>
                </button>
                <a
                  href="http://localhost:8008/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-gray-600">📖</span>
                  <div>
                    <div className="font-medium">API Documentation</div>
                    <div className="text-sm text-gray-500">Forecast API Docs</div>
                  </div>
                </a>
                <a
                  href="http://localhost:5000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-purple-600">📊</span>
                  <div>
                    <div className="font-medium">MLflow Tracking</div>
                    <div className="text-sm text-gray-500">Model experiments</div>
                  </div>
                </a>
                <a
                  href="http://localhost:9090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-red-600">📊</span>
                  <div>
                    <div className="font-medium">View Metrics</div>
                    <div className="text-sm text-gray-500">Prometheus dashboard</div>
                  </div>
                </a>
                <a
                  href="http://localhost:13000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                >
                  <span className="text-green-600">📈</span>
                  <div>
                    <div className="font-medium">Analytics Dashboard</div>
                    <div className="text-sm text-gray-500">Grafana</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}