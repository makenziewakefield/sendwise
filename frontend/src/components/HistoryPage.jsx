import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/History.scss";
import { mockTransactions } from "../mocks/mockTransactions";

const HistoryPage = () => {
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
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [showAmountOptions, setShowAmountOptions] = useState(false);
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  const [amountFromError, setAmountFromError] = useState(false);
  const [amountToError, setAmountToError] = useState(false);

  useEffect(() => {
    filterTransactions("Last 15 days");
  }, []);

  const filterTransactions = (option) => {
    let filteredTransactions = [...mockTransactions];
    if (option !== "All") {
      const today = new Date();
      let startDate = new Date(today);
      switch (option) {
        case "Last 15 days":
          startDate.setDate(today.getDate() - 15);
          break;
        case "Last 30 days":
          startDate.setDate(today.getDate() - 30);
          break;
        case "Last 12 months":
          startDate.setMonth(today.getMonth() - 12);
          break;
        default:
          startDate.setDate(today.getDate() - 15);
      }
      filteredTransactions = filteredTransactions.filter(
        (transaction) => new Date(transaction.date) >= startDate
      );
    }
    setTransactions(filteredTransactions);
    setIsLoading(false);
  };

  const handleDateFilterChange = (option) => {
    setDateFilter(option);
    setShowDateOptions(false);
    filterTransactions(option);
    if (option !== "Custom") {
      setFromDate(null);
      setToDate(null);
    }
  };

  const handleCustomDateSearch = () => {
    if (fromDate && toDate) {
      const filteredTransactions = mockTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
      setTransactions(filteredTransactions);
      setShowDateOptions(false);
      setDateFilter(
        `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
      );
    }
  };

  const formatAmount = (value) => {
    if (value === "") return "";
    let number = parseFloat(value);
    if (isNaN(number)) return "";
    number = Math.round(number * 100) / 100;
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (e, setter) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 3) return;
    setter(value);
  };

  const handleAmountBlur = (value, setter) => {
    setter(formatAmount(value));
  };

  const handleAmountRangeSearch = () => {
    if (!amountFrom || !amountTo) {
      setAmountFromError(!amountFrom);
      setAmountToError(!amountTo);
      return;
    }

    const from = parseFloat(amountFrom.replace(/,/g, ""));
    const to = parseFloat(amountTo.replace(/,/g, ""));

    const filteredTransactions = mockTransactions.filter((transaction) => {
      const total = transaction.amount_in + transaction.amount_out;
      return total >= from && total <= to;
    });

    setTransactions(filteredTransactions);
    setShowAmountOptions(false);
    setAmountFilter(`$${amountFrom} - $${amountTo}`);
  };

  const clearAmountRange = () => {
    setAmountFrom("");
    setAmountTo("");
    setAmountFromError(false);
    setAmountToError(false);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

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

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  if (isLoading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="history-page">
      <h1>Transaction History</h1>
      <div className="filters">
        <div className="date-filter">
          <button onClick={() => setShowDateOptions(!showDateOptions)}>
            {dateFilter} ▼
          </button>
          {showDateOptions && (
            <div className="date-options">
              <button onClick={() => handleDateFilterChange("Last 15 days")}>
                Last 15 days
              </button>
              <button onClick={() => handleDateFilterChange("Last 30 days")}>
                Last 30 days
              </button>
              <button onClick={() => handleDateFilterChange("Last 12 months")}>
                Last 12 months
              </button>
              <button onClick={() => handleDateFilterChange("All")}>All</button>
              <div className="custom-date-range">
                <div>
                  <label>From:</label>
                  <input
                    type="text"
                    value={fromDate ? fromDate.toDateString() : ""}
                    onClick={() => setShowFromCalendar(!showFromCalendar)}
                    readOnly
                  />
                  {showFromCalendar && (
                    <Calendar
                      onChange={(date) => {
                        setFromDate(date);
                        setShowFromCalendar(false);
                      }}
                      value={fromDate}
                    />
                  )}
                </div>
                <div>
                  <label>To:</label>
                  <input
                    type="text"
                    value={toDate ? toDate.toDateString() : ""}
                    onClick={() => setShowToCalendar(!showToCalendar)}
                    readOnly
                  />
                  {showToCalendar && (
                    <Calendar
                      onChange={(date) => {
                        setToDate(date);
                        setShowToCalendar(false);
                      }}
                      value={toDate}
                    />
                  )}
                </div>
                <button onClick={handleCustomDateSearch}>View</button>
              </div>
            </div>
          )}
        </div>
        <div className="amount-filter">
          <button onClick={() => setShowAmountOptions(!showAmountOptions)}>
            {amountFilter} ▼
          </button>
          {showAmountOptions && (
            <div className="amount-options">
              <div className="amount-inputs">
                <div className="amount-input">
                  <label>From:</label>
                  <div className="input-wrapper">
                    <span className="dollar-sign">$</span>
                    <input
                      type="text"
                      value={amountFrom}
                      onChange={(e) => handleAmountChange(e, setAmountFrom)}
                      onBlur={() => handleAmountBlur(amountFrom, setAmountFrom)}
                      placeholder="0.00"
                    />
                  </div>
                  {amountFromError && (
                    <span className="error">This field is required.</span>
                  )}
                </div>
                <div className="amount-input">
                  <label>To:</label>
                  <div className="input-wrapper">
                    <span className="dollar-sign">$</span>
                    <input
                      type="text"
                      value={amountTo}
                      onChange={(e) => handleAmountChange(e, setAmountTo)}
                      onBlur={() => handleAmountBlur(amountTo, setAmountTo)}
                      placeholder="0.00"
                    />
                  </div>
                  {amountToError && (
                    <span className="error">This field is required.</span>
                  )}
                </div>
              </div>
              <div className="amount-buttons">
                <button onClick={handleAmountRangeSearch}>View</button>
                <button onClick={clearAmountRange}>Clear</button>
              </div>
            </div>
          )}
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </div>
      {sortedTransactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort("date")}>
                Date {getClassNamesFor("date") === "ascending" ? "▲" : "▼"}
              </th>
              <th onClick={() => requestSort("description")}>
                Description{" "}
                {getClassNamesFor("description") === "ascending" ? "▲" : "▼"}
              </th>
              <th onClick={() => requestSort("category")}>
                Category{" "}
                {getClassNamesFor("category") === "ascending" ? "▲" : "▼"}
              </th>
              <th onClick={() => requestSort("amount_in")}>
                Amount In{" "}
                {getClassNamesFor("amount_in") === "ascending" ? "▲" : "▼"}
              </th>
              <th onClick={() => requestSort("amount_out")}>
                Amount Out{" "}
                {getClassNamesFor("amount_out") === "ascending" ? "▲" : "▼"}
              </th>
              <th onClick={() => requestSort("balance")}>
                Balance{" "}
                {getClassNamesFor("balance") === "ascending" ? "▲" : "▼"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount_in}</td>
                <td>{transaction.amount_out}</td>
                <td>{transaction.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-transactions">No transactions found</div>
      )}
    </div>
  );
};

export default HistoryPage;
