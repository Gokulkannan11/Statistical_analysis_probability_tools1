const express = require('express');
const cors = require('cors');
const jStat = require('jstat');
const math = require('mathjs');
const ss = require('simple-statistics');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper function to generate data points for plotting
function generateDataPoints(distribution, params, start, end, numPoints = 200) {
  const step = (end - start) / numPoints;
  const xValues = [];
  const yValues = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = start + (i * step);
    xValues.push(x);

    let y;
    switch(distribution) {
      case 'normal':
        y = jStat.normal.pdf(x, params.mean, params.stdDev);
        break;
      case 'exponential':
        y = jStat.exponential.pdf(x, params.lambda);
        break;
      case 'uniform':
        y = jStat.uniform.pdf(x, params.min, params.max);
        break;
      case 'binomial':
        y = jStat.binomial.pdf(Math.round(x), params.n, params.p);
        break;
      case 'poisson':
        y = jStat.poisson.pdf(Math.round(x), params.lambda);
        break;
      case 'chisquare':
        y = jStat.chisquare.pdf(x, params.df);
        break;
      case 't':
        y = jStat.studentt.pdf(x, params.df);
        break;
      default:
        y = 0;
    }
    yValues.push(y);
  }

  return { xValues, yValues };
}

// Normal Distribution Endpoint
app.post('/api/distribution/normal', (req, res) => {
  try {
    const { mean, stdDev, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.normal.cdf(x, mean, stdDev)
      : jStat.normal.pdf(x, mean, stdDev);

    const start = mean - 4 * stdDev;
    const end = mean + 4 * stdDev;
    const plotData = generateDataPoints('normal', { mean, stdDev }, start, end);

    res.json({
      probability,
      mean,
      stdDev,
      variance: Math.pow(stdDev, 2),
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Exponential Distribution Endpoint
app.post('/api/distribution/exponential', (req, res) => {
  try {
    const { lambda, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.exponential.cdf(x, lambda)
      : jStat.exponential.pdf(x, lambda);

    const plotData = generateDataPoints('exponential', { lambda }, 0, 5 / lambda);

    res.json({
      probability,
      lambda,
      mean: 1 / lambda,
      variance: 1 / (lambda * lambda),
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Binomial Distribution Endpoint
app.post('/api/distribution/binomial', (req, res) => {
  try {
    const { n, p, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.binomial.cdf(x, n, p)
      : jStat.binomial.pdf(x, n, p);

    const plotData = generateDataPoints('binomial', { n, p }, 0, n);

    res.json({
      probability,
      n,
      p,
      mean: n * p,
      variance: n * p * (1 - p),
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Poisson Distribution Endpoint
app.post('/api/distribution/poisson', (req, res) => {
  try {
    const { lambda, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.poisson.cdf(x, lambda)
      : jStat.poisson.pdf(x, lambda);

    const plotData = generateDataPoints('poisson', { lambda }, 0, lambda * 3);

    res.json({
      probability,
      lambda,
      mean: lambda,
      variance: lambda,
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chi-Square Distribution Endpoint
app.post('/api/distribution/chisquare', (req, res) => {
  try {
    const { df, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.chisquare.cdf(x, df)
      : jStat.chisquare.pdf(x, df);

    const plotData = generateDataPoints('chisquare', { df }, 0, df * 3);

    res.json({
      probability,
      df,
      mean: df,
      variance: 2 * df,
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// T-Distribution Endpoint
app.post('/api/distribution/t', (req, res) => {
  try {
    const { df, x, cumulative } = req.body;

    const probability = cumulative
      ? jStat.studentt.cdf(x, df)
      : jStat.studentt.pdf(x, df);

    const plotData = generateDataPoints('t', { df }, -5, 5);

    res.json({
      probability,
      df,
      mean: 0,
      variance: df > 2 ? df / (df - 2) : null,
      plotData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Hypothesis Testing - T-Test (One Sample)
app.post('/api/hypothesis/ttest-one', (req, res) => {
  try {
    const { data, mu, alpha, alternative } = req.body;

    const n = data.length;
    const sampleMean = ss.mean(data);
    const sampleStd = ss.standardDeviation(data);
    const se = sampleStd / Math.sqrt(n);

    const tStatistic = (sampleMean - mu) / se;
    const df = n - 1;

    let pValue;
    if (alternative === 'two-sided') {
      pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), df));
    } else if (alternative === 'greater') {
      pValue = 1 - jStat.studentt.cdf(tStatistic, df);
    } else {
      pValue = jStat.studentt.cdf(tStatistic, df);
    }

    const criticalValue = jStat.studentt.inv(1 - alpha / 2, df);
    const reject = pValue < alpha;

    res.json({
      tStatistic,
      pValue,
      criticalValue,
      degreesOfFreedom: df,
      sampleMean,
      sampleStd,
      reject,
      conclusion: reject
        ? `Reject null hypothesis at α = ${alpha}`
        : `Fail to reject null hypothesis at α = ${alpha}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Hypothesis Testing - T-Test (Two Sample)
app.post('/api/hypothesis/ttest-two', (req, res) => {
  try {
    const { data1, data2, alpha, alternative } = req.body;

    const n1 = data1.length;
    const n2 = data2.length;
    const mean1 = ss.mean(data1);
    const mean2 = ss.mean(data2);
    const var1 = ss.variance(data1);
    const var2 = ss.variance(data2);

    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const se = Math.sqrt(pooledVar * (1/n1 + 1/n2));

    const tStatistic = (mean1 - mean2) / se;
    const df = n1 + n2 - 2;

    let pValue;
    if (alternative === 'two-sided') {
      pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), df));
    } else if (alternative === 'greater') {
      pValue = 1 - jStat.studentt.cdf(tStatistic, df);
    } else {
      pValue = jStat.studentt.cdf(tStatistic, df);
    }

    const reject = pValue < alpha;

    res.json({
      tStatistic,
      pValue,
      degreesOfFreedom: df,
      mean1,
      mean2,
      reject,
      conclusion: reject
        ? `Reject null hypothesis at α = ${alpha}`
        : `Fail to reject null hypothesis at α = ${alpha}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Linear Regression
app.post('/api/regression/linear', (req, res) => {
  try {
    const { xData, yData } = req.body;

    if (xData.length !== yData.length) {
      throw new Error('X and Y data must have the same length');
    }

    const regression = ss.linearRegression([xData, yData]);
    const regressionLine = ss.linearRegressionLine(regression);

    const yPredicted = xData.map(x => regressionLine(x));
    const residuals = yData.map((y, i) => y - yPredicted[i]);

    const yMean = ss.mean(yData);
    const ssTotal = ss.sum(yData.map(y => Math.pow(y - yMean, 2)));
    const ssResidual = ss.sum(residuals.map(r => Math.pow(r, 2)));
    const rSquared = 1 - (ssResidual / ssTotal);

    const correlation = ss.sampleCorrelation(xData, yData);

    res.json({
      slope: regression.m,
      intercept: regression.b,
      rSquared,
      correlation,
      equation: `y = ${regression.m.toFixed(4)}x + ${regression.b.toFixed(4)}`,
      predictions: yPredicted,
      residuals
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate Random Dataset
app.post('/api/dataset/generate', (req, res) => {
  try {
    const { distribution, size, params } = req.body;

    let data = [];

    switch(distribution) {
      case 'normal':
        for (let i = 0; i < size; i++) {
          data.push(jStat.normal.sample(params.mean, params.stdDev));
        }
        break;
      case 'exponential':
        for (let i = 0; i < size; i++) {
          data.push(jStat.exponential.sample(params.lambda));
        }
        break;
      case 'uniform':
        for (let i = 0; i < size; i++) {
          data.push(jStat.uniform.sample(params.min, params.max));
        }
        break;
      default:
        throw new Error('Unsupported distribution');
    }

    res.json({
      data,
      size,
      mean: ss.mean(data),
      stdDev: ss.standardDeviation(data),
      min: ss.min(data),
      max: ss.max(data)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Statistical Analysis API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
