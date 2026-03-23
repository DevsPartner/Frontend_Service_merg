'use client';

import { useState, useEffect } from 'react';

export default function HealthStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8008/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      setHealth({ 
        status: 'unhealthy', 
        error: 'Cannot connect to forecasting service',
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Forecasting Service</h3>
        <button
          onClick={checkHealth}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <div>
          <div className="font-medium text-gray-900">
            {isHealthy ? 'Service is operational' : 'Service unavailable'}
          </div>
          <div className="text-sm text-gray-600">
            {isHealthy 
              ? `Connected to forecasting service`
              : health?.error || 'Cannot connect to forecasting service'
            }
          </div>
        </div>
      </div>

      {/* Service URLs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Forecasting API</div>
          <a 
            href="http://localhost:8008/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            http://localhost:8008
          </a>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">MLflow</div>
          <a 
            href="http://localhost:5000"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            http://localhost:5000
          </a>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Prometheus</div>
          <a 
            href="http://localhost:9090"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            http://localhost:9090
          </a>
        </div>
      </div>
    </div>
  );
}