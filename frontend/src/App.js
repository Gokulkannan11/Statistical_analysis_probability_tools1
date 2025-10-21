import React, { useState } from 'react';
import './App.css';
import DistributionAnalysis from './components/DistributionAnalysis';
import HypothesisTesting from './components/HypothesisTesting';
import RegressionAnalysis from './components/RegressionAnalysis';

function App() {
  const [activeTab, setActiveTab] = useState('distributions');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Statistical Analysis & Probability Tools</h1>
        <p>Comprehensive tool for statistical analysis, hypothesis testing, and regression</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeTab === 'distributions' ? 'active' : ''}
          onClick={() => setActiveTab('distributions')}
        >
          Distributions
        </button>
        <button
          className={activeTab === 'hypothesis' ? 'active' : ''}
          onClick={() => setActiveTab('hypothesis')}
        >
          Hypothesis Testing
        </button>
        <button
          className={activeTab === 'regression' ? 'active' : ''}
          onClick={() => setActiveTab('regression')}
        >
          Regression Analysis
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'distributions' && <DistributionAnalysis />}
        {activeTab === 'hypothesis' && <HypothesisTesting />}
        {activeTab === 'regression' && <RegressionAnalysis />}
      </main>

      <footer className="App-footer">
        <p>Statistical Analysis Tools - Built with React and Node.js</p>
      </footer>
    </div>
  );
}

export default App;
