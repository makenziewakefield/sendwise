import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const SpendingLastWeekChart = ({ userId }) => {
  const { chartUrl, loading, error } = useFetchChart(
    `/api/v1/analytics/spending-last-week-chart?user_id=${userId}`, 
    'line', 
    [], 
    [] 
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Spending Over the Week</h2>
      {chartUrl && <img src={chartUrl} alt="Spending Over the Last Week Chart" />}
    </div>
  );
};

export default SpendingLastWeekChart;