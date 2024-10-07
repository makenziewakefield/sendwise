import React from 'react';
import useFetchChart from '../hooks/useFetchChart';

const IncomingTransfersChart = ({ userId }) => {
  const { chartUrl, loading, error } = useFetchChart(
    `/api/v1/analytics/incoming-transfers-chart?user_id=${userId}`, // Fetch the chart with the user_id
    'bar',
    [], 
    [] 
  );

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Total Transfers from Senders</h2>
      {chartUrl && <img src={chartUrl} alt="Incoming Transfers Chart" />}
    </div>
  );
};

export default IncomingTransfersChart;