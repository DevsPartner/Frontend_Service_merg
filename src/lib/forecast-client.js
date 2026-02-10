const FORECASTING_SERVICE_URL = process.env.FORECASTING_SERVICE_URL || 'http://localhost:8008';

class ForecastClient {
  async healthCheck() {
    try {
      const response = await fetch(`${FORECASTING_SERVICE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async getForecast(options) {
    try {
      const response = await fetch(`${FORECASTING_SERVICE_URL}/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async trainModels(productIds = [], forceRetrain = false) {
    try {
      const response = await fetch(`${FORECASTING_SERVICE_URL}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: productIds,
          force_retrain
        })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async getModelInfo(productId) {
    try {
      const response = await fetch(`${FORECASTING_SERVICE_URL}/models/${productId}`);
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateDataset() {
    try {
      const response = await fetch(`${FORECASTING_SERVICE_URL}/data/update`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async getAvailableProducts() {
    try {
      // UPDATE THIS LINE ONLY: Change from environment variable to direct port 18002
      const response = await fetch('http://localhost:8000/products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
}

export const forecastClient = new ForecastClient();