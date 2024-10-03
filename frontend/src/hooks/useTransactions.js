import { useState, useEffect } from "react";
import axios from "axios";
import {
  filterTransactionsByDate,
  filterTransactionsByCustomDate,
} from "../utils/dateUtils";
import { filterTransactionsByAmount } from "../utils/filterUtils";
import { getUserIdFromToken } from "../utils/tokenUtils";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState("Last 15 days");
  const [amountFilter, setAmountFilter] = useState("Amount range");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [customAmountRange, setCustomAmountRange] = useState({
    from: "",
    to: "",
  });

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token); // Add this line

      if (!token) {
        throw new Error("No authentication token found");
      }
      const userId = getUserIdFromToken(token);
      console.log("User ID from token:", userId); // Add this line

      if (!userId) {
        throw new Error("Invalid user ID from token");
      }
      const response = await axios.get(`/api/v1/transactions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Process transactions to include transfers and calculate balance
      const processedTransactions = response.data.map((t, index, array) => {
        const balance = array.slice(0, index + 1).reduce((acc, curr) => {
          return acc + (curr.amount_in || 0) - (curr.amount_out || 0);
        }, 0);
        return {
          ...t,
          category: t.category || "Transfer",
          balance: balance.toFixed(2),
        };
      });

      setTransactions(processedTransactions);
      setFilteredTransactions(processedTransactions);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.error || err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    dateFilter,
    amountFilter,
    transactions,
    fromDate,
    toDate,
    customAmountRange,
  ]);

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by date (predefined range or custom date)
    if (fromDate && toDate) {
      filtered = filterTransactionsByCustomDate(filtered, fromDate, toDate);
    } else {
      filtered = filterTransactionsByDate(filtered, dateFilter);
    }

    // Filter by amount
    filtered = filterTransactionsByAmount(
      filtered,
      amountFilter,
      amountFilter === "Custom" ? customAmountRange : null
    );

    setFilteredTransactions(filtered);
  };

  const handleDateFilterChange = (option) => {
    setDateFilter(option);
    if (option !== "Custom") {
      setFromDate(null);
      setToDate(null);
    }
  };

  const handleCustomDateSearch = () => {
    if (fromDate && toDate) {
      applyFilters();
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return {
    transactions: filteredTransactions,
    dateFilter,
    amountFilter,
    searchTerm,
    sortConfig,
    isLoading,
    error,
    fromDate,
    toDate,
    setSearchTerm,
    handleDateFilterChange,
    handleCustomDateSearch,
    setFromDate,
    setToDate,
    requestSort,
    setAmountFilter,
    customAmountRange,
    setCustomAmountRange,
  };
};

export default useTransactions;
