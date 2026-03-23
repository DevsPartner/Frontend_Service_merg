// src/lib/forecast-client.js

class ForecastClient {
  async healthCheck() {
    try {
      const response = await fetch('http://localhost:8008/health');
      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async getForecast(options) {
    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async trainModels(productIds = [], forceRetrain = false) {
    try {
      const response = await fetch('/api/forecast/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          force_retrain: forceRetrain,
        }),
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async getModelInfo(productId) {
    try {
      const response = await fetch(`http://localhost:8008/models/${productId}`);
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateDataset() {
    try {
      const response = await fetch('http://localhost:8008/data/update', {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async getAvailableProducts() {
    try {
      const response = await fetch('/api/products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
}

export const forecastClient = new ForecastClient();