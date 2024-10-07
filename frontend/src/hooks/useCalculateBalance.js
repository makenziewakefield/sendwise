import { useState, useEffect } from "react";

const useCalculateBalance = (transactions) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let totalIn = 0;
    let totalOut = 0;

    transactions.forEach((transaction) => {
      totalIn += parseFloat(transaction.amount_in || 0);
      totalOut += parseFloat(transaction.amount_out || 0);
    });

    setBalance(totalIn - totalOut); // Assuming balance starts from 0
  }, [transactions]);

  return balance;
};

export default useCalculateBalance;
