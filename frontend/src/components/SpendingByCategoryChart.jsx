import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const SpendingByCategoryChart = ({ userId }) => {
  const { chartUrl, loading, error } = useFetchChart(
    `/api/v1/analytics/spending-by-category-chart?user_id=${userId}`, // Append the user_id in the URL query
    'pie', 
    [], 
    [] 
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Spending by Category</h2>
      {chartUrl && <img src={chartUrl} alt="Spending by Category Chart" />}
    </div>
  );
};

export default SpendingByCategoryChart;