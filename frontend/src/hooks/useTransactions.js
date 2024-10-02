import { useState, useEffect } from "react";
import axios from "axios";
import {
  filterTransactionsByDate,
  filterTransactionsByCustomDate,
} from "../utils/dateUtils";
import { filterTransactionsByAmount } from "../utils/filterUtils";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
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
      const response = await axios.get("/api/transactions");
      setTransactions(response.data); // Assuming the API returns an array of transactions
      setIsLoading(false);
    } catch (err) {
      setError("Error fetching transactions: " + err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); // Initial fetch from the backend
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateFilter, amountFilter]);

  const applyFilters = () => {
    let filteredTransactions;

    // Filter by date (predefined range or custom date)
    if (fromDate && toDate) {
      filteredTransactions = filterTransactionsByCustomDate(
        transactions,
        fromDate,
        toDate
      );
    } else {
      filteredTransactions = filterTransactionsByDate(transactions, dateFilter);
    }

    // Filter by amount
    filteredTransactions = filterTransactionsByAmount(
      filteredTransactions,
      amountFilter,
      amountFilter === "Custom" ? customAmountRange : null
    );

    setTransactions(filteredTransactions);
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
    transactions,
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
