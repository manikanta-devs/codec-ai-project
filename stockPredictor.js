/**
 * stockPredictor.js
 * Client-side regression modelling.
 */

// --- MATRIX MATH UTILITIES (for Polynomial Regression) ---

function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array(cols).fill(0).map(() => Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

function multiply(A, B) {
  const rA = A.length;
  const cA = A[0].length;
  const rB = B.length;
  const cB = B[0].length;
  if (cA !== rB) throw new Error("Matrix dimensions mismatch for multiplication");
  
  const result = Array(rA).fill(0).map(() => Array(cB).fill(0));
  for (let i = 0; i < rA; i++) {
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function invertMatrix(matrix) {
  const n = matrix.length;
  const aug = matrix.map((row, i) => {
    const identityRow = Array(n).fill(0);
    identityRow[i] = 1;
    return [...row, ...identityRow];
  });

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }
    
    const temp = aug[i];
    aug[i] = aug[maxRow];
    aug[maxRow] = temp;

    const pivot = aug[i][i];
    if (Math.abs(pivot) < 1e-10) {
      throw new Error("Matrix is singular and cannot be inverted");
    }

    for (let j = i; j < 2 * n; j++) {
      aug[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = i; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  return aug.map(row => row.slice(n));
}

// --- MODEL FITTER CLASS ---

export class StockEngine {
  constructor() {
    this.history = []; // [{ date: string, price: number }]
  }

  /**
   * Sets the historical data from the API response
   * @param {Array} apiPrices - list of { date, close }
   */
  setHistoricalData(apiPrices) {
    this.history = apiPrices.map((p, i) => ({
      day: i + 1,
      date: p.date,
      price: p.close
    }));
  }

  /**
   * Fits a model to historical data and predicts the future horizon.
   * @param {string} modelType - 'linear', 'polynomial-2', 'polynomial-3', 'ema'
   * @param {number} lookback - number of historical days to train on
   * @param {number} forecast - number of future days to predict
   */
  fitAndPredict(modelType, lookback, forecast) {
    const trainData = this.history.slice(-lookback);
    const n = trainData.length;
    
    // Feature normalization: t starts at 1
    const tOffset = trainData[0].day;
    const t = trainData.map(d => d.day - tOffset + 1);
    const y = trainData.map(d => d.price);

    let predictions = [];
    let coefficients = [];
    let mse = 0;
    let r2 = 0;
    let isBullish = true;

    if (modelType.startsWith('polynomial') || modelType === 'linear') {
      let degree = 1;
      if (modelType === 'polynomial-2') degree = 2;
      else if (modelType === 'polynomial-3') degree = 3;

      const X = Array(n).fill(0).map((_, i) => {
        const row = [];
        for (let d = 0; d <= degree; d++) {
          row.push(Math.pow(t[i], d));
        }
        return row;
      });

      const Y_col = y.map(val => [val]);
      
      try {
        const XT = transpose(X);
        const XTX = multiply(XT, X);
        const XTX_inv = invertMatrix(XTX);
        const XTY = multiply(XT, Y_col);
        const beta = multiply(XTX_inv, XTY);
        coefficients = beta.map(row => row[0]);
      } catch (err) {
        console.warn("Matrix inversion failed, falling back to simple linear regression", err);
        degree = 1;
        const meanT = t.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        let num = 0, den = 0;
        for (let i = 0; i < n; i++) {
          num += (t[i] - meanT) * (y[i] - meanY);
          den += (t[i] - meanT) * (t[i] - meanT);
        }
        const b1 = den !== 0 ? num / den : 0;
        const b0 = meanY - b1 * meanT;
        coefficients = [b0, b1];
      }

      const evalPolynomial = (timeVal) => {
        let sum = 0;
        for (let d = 0; d <= degree; d++) {
          sum += coefficients[d] * Math.pow(timeVal, d);
        }
        return sum;
      };

      const yFit = t.map(timeVal => evalPolynomial(timeVal));

      const meanY = y.reduce((a, b) => a + b, 0) / n;
      let ssRes = 0;
      let ssTot = 0;
      for (let i = 0; i < n; i++) {
        ssRes += (y[i] - yFit[i]) * (y[i] - yFit[i]);
        ssTot += (y[i] - meanY) * (y[i] - meanY);
      }
      mse = ssRes / n;
      r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

      predictions = trainData.map((d, i) => ({
        day: d.day,
        date: d.date,
        predictedPrice: parseFloat(yFit[i].toFixed(2)),
        isForecast: false
      }));

      // Project into the future
      const lastDay = trainData[trainData.length - 1].day;
      const lastDate = new Date(trainData[trainData.length - 1].date);
      
      let nextDate = new Date(lastDate);
      for (let i = 1; i <= forecast; i++) {
        const targetDay = lastDay + i;
        const normTime = targetDay - tOffset + 1;
        
        // Advance date skipping weekends (Saturday = 6, Sunday = 0)
        do {
          nextDate.setDate(nextDate.getDate() + 1);
        } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);

        predictions.push({
          day: targetDay,
          date: nextDate.toISOString().split('T')[0],
          predictedPrice: parseFloat(evalPolynomial(normTime).toFixed(2)),
          isForecast: true
        });
      }

      const startForecast = evalPolynomial(n + 1);
      const endForecast = evalPolynomial(n + forecast);
      isBullish = endForecast >= startForecast;

    } else if (modelType === 'ema') {
      const k = 10;
      const alpha = 2 / (k + 1);
      
      const emaFit = [];
      let currentEma = y[0];
      emaFit.push(currentEma);

      for (let i = 1; i < n; i++) {
        currentEma = alpha * y[i] + (1 - alpha) * currentEma;
        emaFit.push(currentEma);
      }

      let ssRes = 0;
      const meanY = y.reduce((a, b) => a + b, 0) / n;
      let ssTot = 0;
      for (let i = 0; i < n; i++) {
        ssRes += (y[i] - emaFit[i]) * (y[i] - emaFit[i]);
        ssTot += (y[i] - meanY) * (y[i] - meanY);
      }
      mse = ssRes / n;
      r2 = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

      predictions = trainData.map((d, i) => ({
        day: d.day,
        date: d.date,
        predictedPrice: parseFloat(emaFit[i].toFixed(2)),
        isForecast: false
      }));

      // Project into future using local momentum (drift of last 5 days EMA)
      let localDrift = 0;
      if (n > 5) {
        const lastFew = emaFit.slice(-5);
        localDrift = (lastFew[lastFew.length - 1] - lastFew[0]) / 4;
      }

      const lastDay = trainData[trainData.length - 1].day;
      const lastDate = new Date(trainData[trainData.length - 1].date);
      
      let lastVal = emaFit[emaFit.length - 1];
      let nextDate = new Date(lastDate);
      
      for (let i = 1; i <= forecast; i++) {
        lastVal += localDrift;
        
        do {
          nextDate.setDate(nextDate.getDate() + 1);
        } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);

        predictions.push({
          day: lastDay + i,
          date: nextDate.toISOString().split('T')[0],
          predictedPrice: parseFloat(lastVal.toFixed(2)),
          isForecast: true
        });
      }

      isBullish = localDrift >= 0;
    }

    return {
      predictions,
      metrics: {
        mse: parseFloat(mse.toFixed(2)),
        r2: parseFloat(r2.toFixed(3)),
        isBullish
      }
    };
  }
}
