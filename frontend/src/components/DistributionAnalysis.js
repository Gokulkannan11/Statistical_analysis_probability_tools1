import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:5001/api';

function DistributionAnalysis() {
  const [distribution, setDistribution] = useState('normal');
  const [params, setParams] = useState({
    mean: 0,
    stdDev: 1,
    lambda: 1,
    n: 10,
    p: 0.5,
    df: 5,
    min: 0,
    max: 1,
    x: 0
  });
  const [cumulative, setCumulative] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      let endpoint = `${API_BASE}/distribution/${distribution}`;
      let body = { cumulative, x: params.x };

      switch (distribution) {
        case 'normal':
          body = { ...body, mean: params.mean, stdDev: params.stdDev };
          break;
        case 'exponential':
          body = { ...body, lambda: params.lambda };
          break;
        case 'binomial':
          body = { ...body, n: params.n, p: params.p };
          break;
        case 'poisson':
          body = { ...body, lambda: params.lambda };
          break;
        case 'chisquare':
          body = { ...body, df: params.df };
          break;
        case 't':
          body = { ...body, df: params.df };
          break;
        default:
          break;
      }

      const response = await axios.post(endpoint, body);
      setResults(response.data);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const renderParameterInputs = () => {
    switch (distribution) {
      case 'normal':
        return (
          <>
            <div className="input-group">
              <label>Mean:</label>
              <input
                type="number"
                value={params.mean}
                onChange={(e) => setParams({ ...params, mean: parseFloat(e.target.value) })}
              />
            </div>
            <div className="input-group">
              <label>Standard Deviation:</label>
              <input
                type="number"
                value={params.stdDev}
                onChange={(e) => setParams({ ...params, stdDev: parseFloat(e.target.value) })}
                min="0.01"
                step="0.1"
              />
            </div>
          </>
        );
      case 'exponential':
        return (
          <div className="input-group">
            <label>Lambda:</label>
            <input
              type="number"
              value={params.lambda}
              onChange={(e) => setParams({ ...params, lambda: parseFloat(e.target.value) })}
              min="0.01"
              step="0.1"
            />
          </div>
        );
      case 'binomial':
        return (
          <>
            <div className="input-group">
              <label>Number of Trials (n):</label>
              <input
                type="number"
                value={params.n}
                onChange={(e) => setParams({ ...params, n: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="input-group">
              <label>Probability (p):</label>
              <input
                type="number"
                value={params.p}
                onChange={(e) => setParams({ ...params, p: parseFloat(e.target.value) })}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </>
        );
      case 'poisson':
        return (
          <div className="input-group">
            <label>Lambda:</label>
            <input
              type="number"
              value={params.lambda}
              onChange={(e) => setParams({ ...params, lambda: parseFloat(e.target.value) })}
              min="0.01"
              step="0.1"
            />
          </div>
        );
      case 'chisquare':
      case 't':
        return (
          <div className="input-group">
            <label>Degrees of Freedom:</label>
            <input
              type="number"
              value={params.df}
              onChange={(e) => setParams({ ...params, df: parseInt(e.target.value) })}
              min="1"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const chartData = results?.plotData
    ? results.plotData.xValues.map((x, i) => ({
        x: x.toFixed(2),
        probability: results.plotData.yValues[i]
      }))
    : [];

  return (
    <div className="distribution-analysis">
      <h2>Distribution Analysis</h2>

      <div className="control-panel">
        <div className="input-group">
          <label>Select Distribution:</label>
          <select value={distribution} onChange={(e) => setDistribution(e.target.value)}>
            <option value="normal">Normal (Gaussian)</option>
            <option value="exponential">Exponential</option>
            <option value="binomial">Binomial</option>
            <option value="poisson">Poisson</option>
            <option value="chisquare">Chi-Square</option>
            <option value="t">Student's t</option>
          </select>
        </div>

        {renderParameterInputs()}

        <div className="input-group">
          <label>Value (x):</label>
          <input
            type="number"
            value={params.x}
            onChange={(e) => setParams({ ...params, x: parseFloat(e.target.value) })}
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={cumulative}
              onChange={(e) => setCumulative(e.target.checked)}
            />
            Cumulative (CDF)
          </label>
        </div>

        <button onClick={handleCalculate} disabled={loading} className="calculate-btn">
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <div className="stats-card">
            <h3>Results</h3>
            <div className="stat-item">
              <span className="stat-label">Probability:</span>
              <span className="stat-value">{results.probability.toFixed(6)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mean:</span>
              <span className="stat-value">{results.mean?.toFixed(4) || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Variance:</span>
              <span className="stat-value">{results.variance?.toFixed(4) || 'N/A'}</span>
            </div>
          </div>

          <div className="chart-container">
            <h3>{cumulative ? 'Cumulative Distribution Function (CDF)' : 'Probability Density Function (PDF)'}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'x', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="probability" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DistributionAnalysis;
