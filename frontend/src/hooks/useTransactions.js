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
      setIsLoading(true); // Start loading
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const userId = getUserIdFromToken(token);

      if (!userId) {
        throw new Error("Invalid user ID from token");
      }

      const response = await axios.get(`/api/v1/transactions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response:", response.data);

      // Ensure we have transactions in the response
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("No transactions found in the API response");
      }

      setTransactions(response.data); // Set transactions
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "An error occurred while fetching transactions");
    } finally {
      setIsLoading(false); // Stop loading in both success and error cases
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
    let filtered = Array.isArray(transactions) ? [...transactions] : [];
    console.log("Transactions before filtering:", filtered);

    // Filter by date (predefined range or custom date)
    if (filtered.length > 0) {
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
      )
    }

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
    setTransactions,
    fetchTransactions,
    setError
  };
};

export default useTransactions;
