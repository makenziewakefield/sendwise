import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const SpendingLastMonthChart = ({ userId }) => {
  const { chartUrl, loading, error } = useFetchChart(
    `/api/v1/analytics/spending-last-month-chart?user_id=${userId}`, // Append the user_id in the URL query
    'line', 
    [], 
    [] 
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Spending Over the Last Month</h2>
      {chartUrl && <img src={chartUrl} alt="Spending Over the Last Month Chart" />}
    </div>
  );
};

export default SpendingLastMonthChart;