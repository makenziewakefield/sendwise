import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const RecipientTransfersChart = ({ senderId }) => {
  const { chartUrl, loading, error } = useFetchChart(
    `/api/v1/analytics/recipient-transfers-chart?sender_id=${senderId}`, // Append the sender_id in the URL query
    'bar', 
    [], 
    [] 
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Total Transfers to Recipients</h2>
      {chartUrl && <img src={chartUrl} alt="Recipient Transfers Chart" />}
    </div>
  );
};

export default RecipientTransfersChart;