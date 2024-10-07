import React from 'react';
import BudgetTrackingChart from '../components/BudgetTrackingChart';
import WalletBalance from '../components/WalletBalance';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import '../styles/Home.scss';

const HomePage = () => {
  const userId = 1; // This can be dynamic based on the logged-in user

  return (
    <div className="home-page">
      <h1>Welcome to SendWise</h1>

      {/* Wallet balance box */}
      <div className="wallet-balance-box">
        <WalletBalance userId={userId} />
      </div>

      {/* Chart grid */}
      <div className="chart-grid">
        {/* Budget Tracking Chart Section */}
        <div className="chart-container">
          <BudgetTrackingChart userId={userId} />
        </div>

        {/* Spending by Category Chart Section */}
        <div className="chart-container">
          <SpendingByCategoryChart userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;