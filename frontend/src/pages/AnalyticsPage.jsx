import React from 'react';
import SpendingByCategoryChart from '../components/SpendingByCategoryChart';

const AnalyticsPage = () => {
  const userId = 1; // Replace with dynamic user ID (e.g., from authentication)

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      <SpendingByCategoryChart userId={userId} />
    </div>
  );
};

export default AnalyticsPage;