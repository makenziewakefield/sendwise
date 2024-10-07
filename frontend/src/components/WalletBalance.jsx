import React, { useState, useEffect } from "react";
import "../styles/Wallet.scss";
import useCalculateBalance from "../hooks/useCalculateBalance";
import { getUserIdFromToken } from "../utils/tokenUtils"; // Ensure token utility is imported

const WalletBalance = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Fetch token from localStorage
  const userId = getUserIdFromToken(token); // Extract userId from token

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/v1/transactions/user/${userId}`);

        if (!response.ok) {
          throw new Error(
            `Error fetching wallet transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions(); // Only fetch transactions if userId is available
    }
  }, [userId]);

  const balance = useCalculateBalance(transactions); // Calculate balance using the custom hook

  if (loading) return <div>Loading wallet balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Wallet Balance</h2>
      <p>
        $
        {balance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );
};

export default WalletBalance;
