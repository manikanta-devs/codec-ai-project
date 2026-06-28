/**
 * app.js
 * Frontend controller for fetching Indian stocks from Python backend and driving Chart.js.
 */

import { StockEngine } from './stockPredictor.js';

const state = {
  stock: {
    engine: new StockEngine(),
    chart: null,
    modelType: 'linear',
    lookback: 60,
    forecast: 15,
    selectedSymbol: 'RELIANCE.NS'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initStockPredictor();
});

function initStockPredictor() {
  const modelTypeSelect = document.getElementById('model-type');
  const lookbackSlider = document.getElementById('lookback-days');
  const lookbackVal = document.getElementById('lookback-val');
  const forecastSlider = document.getElementById('forecast-days');
  const forecastVal = document.getElementById('forecast-val');
  
  const stockPresetSelect = document.getElementById('stock-preset');
  const customTickerInput = document.getElementById('custom-ticker');
  const searchBtn = document.getElementById('search-btn');

  setupStockChart();

  const fetchStockData = async (symbol) => {
    state.stock.selectedSymbol = symbol;
    renderQuoteLoading();

    try {
      let data = null;
      // Try local python API first
      try {
        const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
        if (response.ok) {
          data = await response.json();
        }
      } catch (localErr) {
        console.warn("Local API server offline, falling back to client-side CORS proxy...");
      }

      // If local API failed or was offline, use AllOrigins CORS proxy to query Yahoo Finance directly
      if (!data) {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=6mo&interval=1d`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error("CORS proxy service unavailable.");
        }
        const proxyData = await response.json();
        const yahooData = JSON.parse(proxyData.contents);

        if (!yahooData.chart || !yahooData.chart.result) {
          throw new Error(`Symbol "${symbol}" not found on Yahoo Finance.`);
        }

        const result = yahooData.chart.result[0];
        const quote = result.indicators.quote[0];
        const timestamps = result.timestamp || [];
        const meta = result.meta;

        const prices = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.close[i] !== null && quote.close[i] !== undefined) {
            const dateObj = new Date(timestamps[i] * 1000);
            const dateStr = dateObj.toISOString().split('T')[0];
            prices.push({
              date: dateStr,
              open: quote.open[i] || quote.close[i],
              high: quote.high[i] || quote.close[i],
              low: quote.low[i] || quote.close[i],
              close: quote.close[i],
              volume: quote.volume[i] || 0
            });
          }
        }

        if (prices.length < 2) {
          throw new Error(`Insufficient data found for symbol ${symbol}`);
        }

        const tailPrices = prices.slice(-100);
        const currentPrice = tailPrices[tailPrices.length - 1].close;
        const prevClose = tailPrices[tailPrices.length - 2]?.close || currentPrice;
        const change = currentPrice - prevClose;
        const changePercent = (change / prevClose) * 100;
        const companyName = meta.longName || symbol;

        data = {
          symbol,
          companyName,
          currentPrice: parseFloat(currentPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          prices: tailPrices
        };
      }
      
      state.stock.engine.setHistoricalData(data.prices);
      renderQuoteCard(data);
      updatePredictions();
    } catch (err) {
      renderQuoteError(err.message);
    }
  };

  const updatePredictions = () => {
    const engine = state.stock.engine;
    if (engine.history.length === 0) return;

    const modelType = modelTypeSelect.value;
    const lookback = parseInt(lookbackSlider.value);
    const forecast = parseInt(forecastSlider.value);

    state.stock.modelType = modelType;
    state.stock.lookback = lookback;
    state.stock.forecast = forecast;

    lookbackVal.textContent = `${lookback} Days`;
    forecastVal.textContent = `${forecast} Days`;

    const result = engine.fitAndPredict(modelType, lookback, forecast);
    
    updateStockChartData(result.predictions, lookback);
    updateStockMetrics(result.metrics);
  };

  modelTypeSelect.addEventListener('change', updatePredictions);
  lookbackSlider.addEventListener('input', updatePredictions);
  forecastSlider.addEventListener('input', updatePredictions);

  stockPresetSelect.addEventListener('change', (e) => {
    customTickerInput.value = '';
    fetchStockData(e.target.value);
  });

  const performSearch = () => {
    const symbol = customTickerInput.value.trim().toUpperCase();
    if (symbol) {
      fetchStockData(symbol);
    }
  };

  searchBtn.addEventListener('click', performSearch);
  customTickerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  fetchStockData(state.stock.selectedSymbol);
}

function setupStockChart() {
  const ctx = document.getElementById('stockChart').getContext('2d');
  
  const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
  blueGradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
  blueGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

  const purpleGradient = ctx.createLinearGradient(0, 0, 0, 300);
  purpleGradient.addColorStop(0, 'rgba(157, 78, 221, 0.3)');
  purpleGradient.addColorStop(1, 'rgba(157, 78, 221, 0.0)');

  state.stock.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Historical Close Price (INR)',
          data: [],
          borderColor: '#00f2fe',
          backgroundColor: blueGradient,
          fill: true,
          tension: 0.1,
          pointRadius: 0.5,
          borderWidth: 2
        },
        {
          label: 'Regression Fit / Prediction',
          data: [],
          borderColor: '#9d4edd',
          backgroundColor: purpleGradient,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          borderWidth: 2.5,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#f3f4f6',
            font: { family: 'Outfit', size: 12 }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 10 },
            maxTicksLimit: 12
          }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 10 }
          }
        }
      }
    }
  });
}

function updateStockChartData(predictions, lookback) {
  const engine = state.stock.engine;
  const chart = state.stock.chart;

  const labels = engine.history.map(h => h.date);
  
  const forecastLength = predictions.length - lookback;
  for (let i = 0; i < forecastLength; i++) {
    const idx = lookback + i;
    labels.push(predictions[idx].date);
  }
  
  chart.data.labels = labels;
  chart.data.datasets[0].data = engine.history.map(h => h.price);

  const padCount = engine.history.length - lookback;
  const predData = Array(padCount).fill(null);
  predictions.forEach(p => {
    predData.push(p.predictedPrice);
  });

  chart.data.datasets[1].data = predData;
  chart.update();
}

function updateStockMetrics(metrics) {
  const r2Element = document.getElementById('metric-r2');
  const mseElement = document.getElementById('metric-mse');
  const biasElement = document.getElementById('metric-bias');

  r2Element.textContent = metrics.r2.toFixed(3);
  mseElement.textContent = metrics.mse.toFixed(2);
  
  if (metrics.isBullish) {
    biasElement.textContent = 'BULLISH';
    biasElement.className = 'text-green';
  } else {
    biasElement.textContent = 'BEARISH';
    biasElement.className = 'text-red';
  }
}

function renderQuoteLoading() {
  const container = document.getElementById('quote-display');
  container.innerHTML = `<div class="quote-loading">Fetching current market quote...</div>`;
}

function renderQuoteError(msg) {
  const container = document.getElementById('quote-display');
  container.innerHTML = `<div class="quote-loading" style="color: var(--accent-red)">${msg}</div>`;
}

function renderQuoteCard(data) {
  const container = document.getElementById('quote-display');
  const changeSign = data.change >= 0 ? '+' : '';
  const colorClass = data.change >= 0 ? 'text-green' : 'text-red';
  
  container.innerHTML = `
    <div class="quote-card">
      <span class="quote-title">${data.companyName}</span>
      <span class="quote-subtitle">${data.symbol} &bull; Real-time Quote</span>
      <div class="quote-details">
        <span class="quote-price">₹${data.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        <span class="quote-change ${colorClass}">${changeSign}${data.change.toFixed(2)} (${changeSign}${data.changePercent.toFixed(2)}%)</span>
      </div>
    </div>
  `;
}
