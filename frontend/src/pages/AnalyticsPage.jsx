import React from 'react';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';
import SpendingLastMonthChart from '../components/SpendingLastMonthChart';
import SpendingLastWeekChart from '../components/SpendingLastWeekChart';
import BudgetTrackingChart from '../components/BudgetTrackingChart';
import RecipientTransfersChart from '../components/RecipientTransfersChart';
import IncomingTransfersChart from '../components/IncomingTransfersChart'; 
import { getUserIdFromToken } from "../utils/tokenUtils";
import "../styles/Analytics.scss";

const AnalyticsPage = () => {

  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return <div>Please Log in!</div>; // Show a loading state or handle unauthenticated user
  }

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