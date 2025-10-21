import React, { useState } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const API_BASE = 'http://localhost:5001/api';

function RegressionAnalysis() {
  const [xData, setXData] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  const [yData, setYData] = useState('2.1, 4.2, 5.8, 8.1, 10.3, 12.1, 13.9, 16.2, 18.1, 20.3');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseData = (dataString) => {
    return dataString
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const handleRegression = async () => {
    setLoading(true);
    try {
      const parsedX = parseData(xData);
      const parsedY = parseData(yData);

      if (parsedX.length === 0 || parsedY.length === 0) {
        alert('Please enter valid data');
        setLoading(false);
        return;
      }

      if (parsedX.length !== parsedY.length) {
        alert('X and Y data must have the same length');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE}/regression/linear`, {
        xData: parsedX,
        yData: parsedY
      });

      setResults(response.data);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const generateRandomData = () => {
    const size = 20;
    const slope = 2 + Math.random() * 3;
    const intercept = Math.random() * 5;
    const noise = 2;

    const xValues = [];
    const yValues = [];

    for (let i = 1; i <= size; i++) {
      const x = i;
      const y = slope * x + intercept + (Math.random() - 0.5) * noise * 2;
      xValues.push(x);
      yValues.push(y.toFixed(2));
    }

    setXData(xValues.join(', '));
    setYData(yValues.join(', '));
  };

  const chartData = results
    ? parseData(xData).map((x, i) => ({
        x,
        actual: parseData(yData)[i],
        predicted: results.predictions[i]
      }))
    : [];

  const residualData = results
    ? parseData(xData).map((x, i) => ({
        x,
        residual: results.residuals[i]
      }))
    : [];

  return (
    <div className="regression-analysis">
      <h2>Linear Regression Analysis</h2>

      <div className="control-panel">
        <div className="input-group">
          <label>X Data (comma-separated):</label>
          <textarea
            value={xData}
            onChange={(e) => setXData(e.target.value)}
            rows="3"
            placeholder="e.g., 1, 2, 3, 4, 5"
          />
        </div>

        <div className="input-group">
          <label>Y Data (comma-separated):</label>
          <textarea
            value={yData}
            onChange={(e) => setYData(e.target.value)}
            rows="3"
            placeholder="e.g., 2.1, 4.2, 5.8, 8.1, 10.3"
          />
        </div>

        <div className="button-group">
          <button onClick={handleRegression} disabled={loading} className="calculate-btn">
            {loading ? 'Analyzing...' : 'Run Regression'}
          </button>
          <button onClick={generateRandomData} className="generate-btn">
            Generate Random Data
          </button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <div className="stats-card">
            <h3>Regression Results</h3>

            <div className="stat-item highlight">
              <span className="stat-label">Equation:</span>
              <span className="stat-value equation">{results.equation}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Slope (beta1):</span>
              <span className="stat-value">{results.slope.toFixed(6)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Intercept (beta0):</span>
              <span className="stat-value">{results.intercept.toFixed(6)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">R-Squared (Coefficient of Determination):</span>
              <span className="stat-value">{results.rSquared.toFixed(6)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Correlation (r):</span>
              <span className="stat-value">{results.correlation.toFixed(6)}</span>
            </div>
          </div>

          <div className="interpretation">
            <h4>Interpretation:</h4>
            <p>
              <strong>R-Squared = {results.rSquared.toFixed(4)}</strong>: This means that {(results.rSquared * 100).toFixed(2)}%
              of the variance in Y is explained by X.
            </p>
            <p>
              <strong>Correlation = {results.correlation.toFixed(4)}</strong>: This indicates a {' '}
              {Math.abs(results.correlation) > 0.7 ? 'strong' : Math.abs(results.correlation) > 0.4 ? 'moderate' : 'weak'} {' '}
              {results.correlation > 0 ? 'positive' : 'negative'} linear relationship.
            </p>
          </div>

          <div className="chart-container">
            <h3>Regression Plot</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Y', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Scatter name="Actual Data" dataKey="actual" fill="#8884d8" />
                <Line name="Regression Line" type="monotone" dataKey="predicted" stroke="#ff7300" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Residual Plot</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={residualData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'X', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Residuals', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Scatter name="Residuals" dataKey="residual" fill="#82ca9d" />
                <Line type="monotone" dataKey={() => 0} stroke="#ff0000" strokeWidth={1} dot={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegressionAnalysis;
