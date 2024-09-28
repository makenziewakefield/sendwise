import { useState, useEffect } from "react";
import { mockTransactions } from "../mocks/mockTransactions";
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

  useEffect(() => {
    filterTransactions("Last 15 days");
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateFilter, amountFilter]);

  const filterTransactions = (option) => {
    try {
      const filteredByDate = filterTransactionsByDate(mockTransactions, option);
      const filteredByAmount = filterTransactionsByAmount(
        filteredByDate,
        amountFilter
      );
      setTransactions(filteredByAmount);
      setIsLoading(false);
    } catch (err) {
      setError("Error filtering transactions: " + err.message);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredTransactions;

    // Check if custom date range is set
    if (fromDate && toDate) {
      filteredTransactions = filterTransactionsByCustomDate(
        mockTransactions,
        fromDate,
        toDate
      );
    } else {
      // Otherwise, filter by the predefined date option
      filteredTransactions = filterTransactionsByDate(
        mockTransactions,
        dateFilter
      );
    }

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
      try {
        const filteredTransactions = filterTransactionsByCustomDate(
          mockTransactions,
          fromDate,
          toDate
        );
        const filteredByAmount = filterTransactionsByAmount(
          filteredTransactions,
          amountFilter
        );
        setTransactions(filteredByAmount);
        setDateFilter(
          `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
        );
      } catch (err) {
        setError("Error applying custom date filter: " + err.message);
      }
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
