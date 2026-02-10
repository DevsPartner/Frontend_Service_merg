'use client';

import { useState, useEffect } from 'react';
import { forecastClient } from '@/lib/forecast-client';

export default function ForecastWidget({ productId, products, period = 'week' }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(productId || '');
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const generateForecast = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    const result = await forecastClient.getForecast({
      product_id: parseInt(selectedProduct),
      period: selectedPeriod
    });
    setForecast(result);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId);
      generateForecast();
    }
  }, [productId, period]);

  const getProductName = () => {
    if (!products || !selectedProduct) return '';
    const product = products.find(p => p.id === parseInt(selectedProduct));
    return product ? product.name : '';
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {products && (
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (ID: {product.id})
              </option>
            ))}
          </select>
        )}
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="day">Daily Forecast</option>
          <option value="week">Weekly Forecast</option>
          <option value="month">Monthly Forecast</option>
          <option value="year">Yearly Forecast</option>
        </select>
        
        <button
          onClick={generateForecast}
          disabled={!selectedProduct || loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="mt-2 text-gray-600">Generating forecast...</div>
        </div>
      ) : forecast && !forecast.error ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Forecast Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total Predicted</div>
                <div className="text-2xl font-bold text-gray-900">
                  {forecast.total_predicted?.toFixed(0) || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg Daily</div>
                <div className="text-2xl font-bold text-gray-900">
                  {forecast.average_daily?.toFixed(1) || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Period</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">
                  {forecast.forecast_type || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Peak Day</div>
                <div className="text-2xl font-bold text-gray-900">
                  {forecast.peak_day?.predicted_quantity?.toFixed(0) || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Predictions Table */}
          {forecast.predictions && forecast.predictions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Daily Predictions</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {forecast.predictions.slice(0, 10).map((pred, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{pred.date}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {pred.predicted_quantity.toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {pred.confidence_low?.toFixed(0)} - {pred.confidence_high?.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {forecast.predictions.length > 10 && (
                  <div className="text-center py-3 text-sm text-gray-500">
                    Showing 10 of {forecast.predictions.length} predictions
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : forecast?.error ? (
        <div className="text-center py-8 bg-red-50 rounded-xl">
          <div className="text-red-600 font-medium">Error generating forecast</div>
          <div className="text-sm text-red-500 mt-1">{forecast.error}</div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="mt-2">Select a product and generate forecast</div>
        </div>
      )}
    </div>
  );
}