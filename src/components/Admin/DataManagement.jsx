'use client';

import { useState } from 'react';
import { forecastClient } from '@/lib/forecast-client';

export default function DataManagement() {
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState(null);

  const updateDataset = async () => {
    setUpdating(true);
    setUpdateResult(null);
    
    const result = await forecastClient.updateDataset();
    setUpdateResult(result);
    setUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Update Dataset */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-2">Update Training Data</h4>
        <p className="text-gray-600 mb-4">
          Fetch latest data from Order, Product, and Payment services to update the training dataset.
        </p>
        
        <button
          onClick={updateDataset}
          disabled={updating}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {updating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Updating Dataset...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update Dataset Now
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {updateResult && (
        <div className={`rounded-xl p-4 ${
          updateResult.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${updateResult.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <div className={`font-medium ${updateResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {updateResult.message}
              </div>
              {updateResult.records && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Records</div>
                    <div className="font-medium">{updateResult.records}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Products</div>
                    <div className="font-medium">{updateResult.products}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium text-green-600">{updateResult.status}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Sources */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Data Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-blue-600 font-medium mb-1">Order Service</div>
            <div className="text-sm text-gray-600">Sales transaction data</div>
            <div className="text-xs text-gray-500 mt-2">{process.env.ORDER_SERVICE_URL}</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-purple-600 font-medium mb-1">Product Service</div>
            <div className="text-sm text-gray-600">Product catalog & inventory</div>
            <div className="text-xs text-gray-500 mt-2">{process.env.PRODUCT_SERVICE_URL}</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-green-600 font-medium mb-1">Payment Service</div>
            <div className="text-sm text-gray-600">Payment transaction data</div>
            <div className="text-xs text-gray-500 mt-2">{process.env.PAYMENT_SERVICE_URL}</div>
          </div>
        </div>
      </div>
    </div>
  );
}