import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const BudgetTrackingChart = ({ userId }) => {
  const { chartUrl, loading, error } = useFetchChart(`/api/v1/analytics/budget-tracking-chart?user_id=${userId}`, 'bar');

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Budget Tracking for the Month</h2>
      {chartUrl && <img src={chartUrl} alt="Budget Tracking Chart" />}
    </div>
  );
};

export default BudgetTrackingChart;