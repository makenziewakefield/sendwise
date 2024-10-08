import React from 'react';
import BudgetTrackingChart from '../components/BudgetTrackingChart';
import WalletBalance from '../components/WalletBalance';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import { getUserIdFromToken } from "../utils/tokenUtils";
import '../styles/Home.scss';

const HomePage = () => {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return <div>Please Log in!</div>; 
  }

  return (
    <div className="home-page">
      <h1>Welcome to SendWise</h1>

      <div className="wallet-balance-box">
        <WalletBalance userId={userId} />
      </div>

      <div className="chart-grid">

        <div className="chart-container">
          <BudgetTrackingChart userId={userId} />
        </div>

        <div className="chart-container">
          <SpendingByCategoryChart userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;