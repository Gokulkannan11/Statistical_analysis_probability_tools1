# Issues Fixed

## 1. React 18/19 Rendering API Issue
**Problem:** The app showed a blank screen because it was using the deprecated `ReactDOM.render()` method.

**Solution:** Updated `/frontend/src/index.js` to use the new `ReactDOM.createRoot()` API:
```javascript
// Old (deprecated)
ReactDOM.render(<App />, document.getElementById('root'));

// New (React 18+)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## 2. Unicode Characters Causing Build Errors
**Problem:** Greek letters and subscript characters in JSX were causing syntax errors.

**Solution:** Replaced all special Unicode characters with plain text:
- `μ` (mu) → "mean" or "mu"
- `σ` (sigma) → "Standard Deviation"
- `λ` (lambda) → "Lambda"
- `α` (alpha) → "alpha"
- `β₀`, `β₁` → "beta0", "beta1"
- `R²` → "R-Squared"

## 3. Port 5000 Conflict on macOS
**Problem:** macOS ControlCenter uses port 5000 by default (Monterey and later).

**Solution:** Changed backend server to use port **5001** instead:
- Updated `backend/server.js`: `const PORT = process.env.PORT || 5001;`
- Updated all frontend API calls to use `http://localhost:5001/api`

## How to Start the Application

### Option 1: Manual Start (Terminal 1 & 2)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Using npm scripts

```bash
npm run dev
```

This starts both servers automatically using `concurrently`.

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001

## Expected Behavior

When you open http://localhost:3000, you should see:
1. A purple gradient background
2. Header: "Statistical Analysis & Probability Tools"
3. Three tabs: Distributions, Hypothesis Testing, Regression Analysis
4. The Distributions tab should be active by default
5. Input controls for distribution parameters
6. A "Calculate" button

## Test the App

### Quick Test - Normal Distribution:
1. Leave default values (Mean: 0, Std Dev: 1, x: 0)
2. Click "Calculate"
3. You should see probability value and a bell curve chart

The app is now fully functional!
