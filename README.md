# Statistical Analysis and Probability Tools

A comprehensive web application for statistical analysis, probability distributions, hypothesis testing, and regression analysis. Built with React frontend and Node.js backend.

## Features

### 1. Distribution Analysis
- **Supported Distributions:**
  - Normal (Gaussian)
  - Exponential
  - Binomial
  - Poisson
  - Chi-Square
  - Student's t-distribution

- **Capabilities:**
  - Calculate PDF (Probability Density Function) and CDF (Cumulative Distribution Function)
  - Visualize distributions with interactive charts
  - View distribution parameters (mean, variance)
  - Real-time plotting of probability curves

### 2. Hypothesis Testing
- **One-Sample t-Test:** Test if a sample mean differs from a known population mean
- **Two-Sample t-Test:** Compare means between two independent samples
- **Features:**
  - Configurable significance levels (α = 0.01, 0.05, 0.10)
  - Multiple alternative hypotheses (two-sided, greater than, less than)
  - Detailed test statistics (t-statistic, p-value, degrees of freedom)
  - Clear conclusions with statistical interpretation
  - Random data generation for testing

### 3. Regression Analysis
- **Linear Regression:** Fit a linear model to data
- **Features:**
  - Calculate slope and intercept
  - Coefficient of determination (R²)
  - Correlation coefficient
  - Regression equation
  - Scatter plot with regression line
  - Residual plot for model diagnostics
  - Random data generation with adjustable parameters

## Technology Stack

### Frontend
- **React:** UI framework
- **Recharts:** Data visualization library
- **Axios:** HTTP client for API requests
- **CSS3:** Custom styling with responsive design

### Backend
- **Node.js:** Runtime environment
- **Express:** Web framework
- **jStat:** Statistical library for distributions
- **mathjs:** Mathematical operations
- **simple-statistics:** Statistical computations (mean, variance, regression)

## Project Structure

```
Statistical_analysis_probability_tools/
├── backend/
│   ├── package.json
│   └── server.js          # Express server with API endpoints
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DistributionAnalysis.js
│   │   │   ├── HypothesisTesting.js
│   │   │   └── RegressionAnalysis.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Step 1: Clone or Download the Project
```bash
cd Statistical_analysis_probability_tools
```

### Step 2: Install Dependencies

#### Option 1: Install All at Once (Recommended)
```bash
npm run install-all
```

#### Option 2: Install Separately
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run Both Frontend and Backend Simultaneously
```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Option 2: Run Separately

#### Terminal 1 - Backend:
```bash
npm run server
# or
cd backend
npm start
```

#### Terminal 2 - Frontend:
```bash
npm run client
# or
cd frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

## API Endpoints

### Distribution Endpoints
- `POST /api/distribution/normal` - Normal distribution
- `POST /api/distribution/exponential` - Exponential distribution
- `POST /api/distribution/binomial` - Binomial distribution
- `POST /api/distribution/poisson` - Poisson distribution
- `POST /api/distribution/chisquare` - Chi-square distribution
- `POST /api/distribution/t` - Student's t-distribution

### Hypothesis Testing Endpoints
- `POST /api/hypothesis/ttest-one` - One-sample t-test
- `POST /api/hypothesis/ttest-two` - Two-sample t-test

### Regression Endpoints
- `POST /api/regression/linear` - Linear regression analysis

### Utility Endpoints
- `POST /api/dataset/generate` - Generate random datasets
- `GET /api/health` - Health check

## Usage Examples

### Example 1: Normal Distribution
1. Select "Distributions" tab
2. Choose "Normal (Gaussian)" from dropdown
3. Set parameters: Mean = 0, Standard Deviation = 1
4. Enter x value: 1.96
5. Check "Cumulative (CDF)" for cumulative probability
6. Click "Calculate"
7. View probability and distribution plot

### Example 2: Hypothesis Testing
1. Select "Hypothesis Testing" tab
2. Choose "One-Sample t-Test"
3. Enter sample data (comma-separated)
4. Set population mean (μ₀)
5. Choose significance level (α)
6. Select alternative hypothesis
7. Click "Run Test"
8. Review test statistics and conclusion

### Example 3: Linear Regression
1. Select "Regression Analysis" tab
2. Enter X data (independent variable)
3. Enter Y data (dependent variable)
4. Click "Run Regression"
5. View equation, R², correlation
6. Analyze regression and residual plots

## Features in Detail

### Interactive Visualizations
- Real-time chart updates
- Responsive design for all screen sizes
- Clear axis labels and legends
- Tooltips for data point details

### Data Generation
- Generate random datasets for testing
- Customizable distribution parameters
- Useful for learning and experimentation

### Statistical Accuracy
- Uses established statistical libraries
- Accurate probability calculations
- Proper hypothesis test procedures
- Standard regression diagnostics

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Kill the process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Kill the process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

### CORS Issues
Make sure the backend server is running on port 5000 and the frontend on port 3000. CORS is configured to allow requests from localhost:3000.

### Module Not Found
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements
- Additional distributions (Uniform, Gamma, Beta)
- Multiple regression analysis
- ANOVA tests
- Non-parametric tests
- Data import/export (CSV, JSON)
- Save and load analysis sessions
- More visualization options

## Contributing
Feel free to fork this project and submit pull requests for improvements.

## License
MIT License

## Support
For issues, questions, or suggestions, please open an issue on the project repository.

---

Built with React and Node.js for statistical analysis education and research.
