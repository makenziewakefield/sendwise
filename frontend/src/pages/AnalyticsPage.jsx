import React from 'react';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import SpendingLastMonthChart from '../components/SpendingLastMonthChart';
import SpendingLastWeekChart from '../components/SpendingLastWeekChart';
import BudgetTrackingChart from '../components/BudgetTrackingChart';
import RecipientTransfersChart from '../components/RecipientTransfersChart'
import IncomingTransfersChart from '../components/IncomingTransfersChart'; 
import "../styles/Analytics.scss";

const AnalyticsPage = () => {
  const userId = 1; 

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      <div className="chart-container">
        <SpendingByCategoryChart userId={userId} />
      </div>
      <div className="chart-container">
        <SpendingLastMonthChart userId={userId} />
      </div>
      <div className="chart-container">
        <SpendingLastWeekChart userId={userId} />
      </div>
      <div className="chart-container">
        <BudgetTrackingChart userId={userId} />
      </div>
      <div className="chart-container">
        <RecipientTransfersChart senderId={userId} />
      </div>
      <div className="chart-container">
        <IncomingTransfersChart userId={userId} />
      </div>
    </div>
  );
};

export default AnalyticsPage;