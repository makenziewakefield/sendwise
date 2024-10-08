import { useState, useEffect } from 'react';

const useFetchChart = (endpoint, type = 'line', labels = [], data = []) => {
  const [chartUrl, setChartUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChart = async () => {
    try {
      const query = `type=${type}&labels=${encodeURIComponent(JSON.stringify(labels))}&data=${encodeURIComponent(JSON.stringify(data))}`;
      const response = await fetch(`${endpoint}&${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chart');
      }
      const blob = await response.blob();
      const chartUrl = URL.createObjectURL(blob);
      setChartUrl(chartUrl);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchChart(); 

    const intervalId = setInterval(() => {
      fetchChart(); 
    }, 30000);

    return () => {
      clearInterval(intervalId); 
      if (chartUrl) {
        URL.revokeObjectURL(chartUrl); 
      }
    };
  }, [endpoint]); 

  return { chartUrl, loading, error };
};

export default useFetchChart;