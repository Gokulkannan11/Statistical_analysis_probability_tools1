# Quick Start Guide

## Installation

1. **Install all dependencies at once:**
   ```bash
   npm run install-all
   ```

## Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Testing the Application

Once both servers are running:

1. Open your browser to `http://localhost:3000`
2. You'll see three tabs: Distributions, Hypothesis Testing, and Regression Analysis

### Quick Test - Normal Distribution
1. Click on "Distributions" tab (should be active by default)
2. Keep the default parameters (Mean: 0, Standard Deviation: 1)
3. Enter x value: 0
4. Click "Calculate"
5. You should see the probability value and a bell curve visualization

### Quick Test - Hypothesis Testing
1. Click on "Hypothesis Testing" tab
2. Keep the default sample data
3. Click "Run Test"
4. You should see test results with t-statistic, p-value, and conclusion

### Quick Test - Regression Analysis
1. Click on "Regression Analysis" tab
2. Keep the default data
3. Click "Run Regression"
4. You should see the regression equation, R-squared value, and scatter plot with regression line

## Troubleshooting

### Port Already in Use Error

If you see "Something is already running on port 3000" or port 5000:

**macOS/Linux:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Backend Not Responding

Make sure backend dependencies are installed:
```bash
cd backend
npm install
npm start
```

### Frontend Not Loading

Make sure frontend dependencies are installed:
```bash
cd frontend
npm install
npm start
```

## Features Available

### Distributions Tab
- Normal (Gaussian), Exponential, Binomial, Poisson, Chi-Square, Student's t
- PDF and CDF calculations
- Interactive parameter inputs
- Real-time visualization

### Hypothesis Testing Tab
- One-sample t-test
- Two-sample t-test
- Configurable significance levels
- Random data generation
- Clear statistical interpretations

### Regression Analysis Tab
- Linear regression
- Scatter plot with regression line
- Residual plots
- R-squared and correlation coefficients
- Random data generation

## Need Help?

Check the main README.md for detailed documentation and examples.
