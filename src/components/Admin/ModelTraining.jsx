'use client';

import { useState, useEffect } from 'react';
import { forecastClient } from '@/lib/forecast-client';

export default function ModelTraining({ products: productsProp }) {
  const [products, setProducts] = useState(productsProp || []);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState(null);
  const [forceRetrain, setForceRetrain] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(!productsProp);

  // If no products prop was passed, fetch them ourselves
  useEffect(() => {
    if (!productsProp) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : []))
        .catch(() => setProducts([]))
        .finally(() => setLoadingProducts(false));
    }
  }, [productsProp]);

  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const trainModels = async () => {
    if (selectedProducts.length === 0) return;
    setTraining(true);
    setResult(null);
    const response = await forecastClient.trainModels(selectedProducts, forceRetrain);
    setResult(response);
    setTraining(false);
  };

  if (loadingProducts) {
    return (
      <div className="flex items-center gap-3 py-8 text-slate-400">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm font-medium">
        No products available for training.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Select Products to Train</h4>
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
          {products.map((product) => (
            <label
              key={product.id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                selectedProducts.includes(product.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleProduct(product.id)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">ID: {product.id}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={forceRetrain}
            onChange={(e) => setForceRetrain(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Force retrain (override existing models)</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={trainModels}
          disabled={selectedProducts.length === 0 || training}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {training ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Training Models...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Train Selected Models ({selectedProducts.length})
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-xl p-4 ${
          result.message ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${result.message ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <div className={`font-medium ${result.message ? 'text-green-800' : 'text-red-800'}`}>
                {result.message || 'Training failed'}
              </div>
              {result.product_ids && (
                <div className="text-sm text-gray-600 mt-1">
                  Product IDs: {result.product_ids.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}