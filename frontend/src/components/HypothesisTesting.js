import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

function HypothesisTesting() {
  const [testType, setTestType] = useState('one-sample');
  const [data1, setData1] = useState('10, 12, 11, 13, 14, 12, 11, 10, 13, 12');
  const [data2, setData2] = useState('15, 16, 14, 15, 17, 16, 14, 15, 16, 15');
  const [mu, setMu] = useState(11.5);
  const [alpha, setAlpha] = useState(0.05);
  const [alternative, setAlternative] = useState('two-sided');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseData = (dataString) => {
    return dataString
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      const parsedData1 = parseData(data1);

      if (parsedData1.length === 0) {
        alert('Please enter valid data');
        setLoading(false);
        return;
      }

      let endpoint, body;

      if (testType === 'one-sample') {
        endpoint = `${API_BASE}/hypothesis/ttest-one`;
        body = {
          data: parsedData1,
          mu,
          alpha,
          alternative
        };
      } else {
        const parsedData2 = parseData(data2);
        if (parsedData2.length === 0) {
          alert('Please enter valid data for both samples');
          setLoading(false);
          return;
        }
        endpoint = `${API_BASE}/hypothesis/ttest-two`;
        body = {
          data1: parsedData1,
          data2: parsedData2,
          alpha,
          alternative
        };
      }

      const response = await axios.post(endpoint, body);
      setResults(response.data);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  const generateRandomData = () => {
    const generateSample = (mean, stdDev, size) => {
      const data = [];
      for (let i = 0; i < size; i++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push((z * stdDev + mean).toFixed(2));
      }
      return data.join(', ');
    };

    setData1(generateSample(12, 2, 20));
    if (testType === 'two-sample') {
      setData2(generateSample(15, 2, 20));
    }
  };

  return (
    <div className="hypothesis-testing">
      <h2>Hypothesis Testing</h2>

      <div className="control-panel">
        <div className="input-group">
          <label>Test Type:</label>
          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="one-sample">One-Sample t-Test</option>
            <option value="two-sample">Two-Sample t-Test</option>
          </select>
        </div>

        <div className="input-group">
          <label>Sample Data 1 (comma-separated):</label>
          <textarea
            value={data1}
            onChange={(e) => setData1(e.target.value)}
            rows="3"
            placeholder="e.g., 10, 12, 11, 13, 14"
          />
        </div>

        {testType === 'two-sample' && (
          <div className="input-group">
            <label>Sample Data 2 (comma-separated):</label>
            <textarea
              value={data2}
              onChange={(e) => setData2(e.target.value)}
              rows="3"
              placeholder="e.g., 15, 16, 14, 15, 17"
            />
          </div>
        )}

        {testType === 'one-sample' && (
          <div className="input-group">
            <label>Population Mean (mu0):</label>
            <input
              type="number"
              value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value))}
              step="0.1"
            />
          </div>
        )}

        <div className="input-group">
          <label>Significance Level (alpha):</label>
          <select value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))}>
            <option value={0.01}>0.01</option>
            <option value={0.05}>0.05</option>
            <option value={0.10}>0.10</option>
          </select>
        </div>

        <div className="input-group">
          <label>Alternative Hypothesis:</label>
          <select value={alternative} onChange={(e) => setAlternative(e.target.value)}>
            <option value="two-sided">Two-sided (mu != mu0)</option>
            <option value="greater">Greater (mu &gt; mu0)</option>
            <option value="less">Less (mu &lt; mu0)</option>
          </select>
        </div>

        <div className="button-group">
          <button onClick={handleTest} disabled={loading} className="calculate-btn">
            {loading ? 'Testing...' : 'Run Test'}
          </button>
          <button onClick={generateRandomData} className="generate-btn">
            Generate Random Data
          </button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <div className="stats-card">
            <h3>Test Results</h3>

            <div className="stat-item highlight">
              <span className="stat-label">Conclusion:</span>
              <span className={`stat-value ${results.reject ? 'reject' : 'fail-reject'}`}>
                {results.conclusion}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">t-Statistic:</span>
              <span className="stat-value">{results.tStatistic.toFixed(4)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">p-Value:</span>
              <span className="stat-value">{results.pValue.toFixed(6)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Degrees of Freedom:</span>
              <span className="stat-value">{results.degreesOfFreedom}</span>
            </div>

            {testType === 'one-sample' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Sample Mean:</span>
                  <span className="stat-value">{results.sampleMean.toFixed(4)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sample Std Dev:</span>
                  <span className="stat-value">{results.sampleStd.toFixed(4)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Critical Value:</span>
                  <span className="stat-value">±{results.criticalValue.toFixed(4)}</span>
                </div>
              </>
            )}

            {testType === 'two-sample' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Sample 1 Mean:</span>
                  <span className="stat-value">{results.mean1.toFixed(4)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sample 2 Mean:</span>
                  <span className="stat-value">{results.mean2.toFixed(4)}</span>
                </div>
              </>
            )}
          </div>

          <div className="interpretation">
            <h4>Interpretation:</h4>
            <p>
              {results.reject ? (
                <>
                  The p-value ({results.pValue.toFixed(6)}) is less than the significance level alpha = {alpha}.
                  We reject the null hypothesis. There is sufficient evidence to support the alternative hypothesis.
                </>
              ) : (
                <>
                  The p-value ({results.pValue.toFixed(6)}) is greater than the significance level alpha = {alpha}.
                  We fail to reject the null hypothesis. There is insufficient evidence to support the alternative hypothesis.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HypothesisTesting;
