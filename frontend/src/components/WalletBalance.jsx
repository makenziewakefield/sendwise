import React, { useState, useEffect } from 'react';
import '../styles/Wallet.scss';

const WalletBalance = ({ userId }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/v1/users/${userId}/wallet-balance`);
        
        if (!response.ok) {
          throw new Error(`Error fetching wallet balance: ${response.statusText}`);
        }

        const data = await response.json();
        setBalance(data.balance);
        setLoading(false);  // Stop loading once the balance is fetched
      } catch (err) {
        console.error(err);
        setError(err.message);  // Display the error in case of failure
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchBalance();
  }, [userId]);

  if (loading) return <div>Loading wallet balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Wallet Balance</h2>
      <p>${balance}</p>
    </div>
  );
};

export default WalletBalance;