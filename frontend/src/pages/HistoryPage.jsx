import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/History.scss";
import useTransactions from "../hooks/useTransactions";
import { filterTransactionsBySearch } from "../utils/filterUtils";
import TransactionTable from "../components/TransactionTable";

const HistoryPage = () => {
  const {
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
  } = useTransactions();

  const [showDateOptions, setShowDateOptions] = useState(false);
  const [showAmountOptions, setShowAmountOptions] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const handleCustomDateSearchWrapper = () => {
    handleCustomDateSearch();
    setShowDateOptions(false);
    setShowFromCalendar(false);
    setShowToCalendar(false);
  };

  const handleDateOptionClick = (option) => {
    handleDateFilterChange(option);
    setShowDateOptions(false); // Close the dropdown after selection
  };

  const handleAmountOptionClick = (option) => {
    setAmountFilter(option);
    setShowAmountOptions(false); // Close the dropdown after selection
  };

  const filteredTransactions = filterTransactionsBySearch(
    transactions,
    searchTerm
  );

  const handleCustomAmountChange = (field, value) => {
    const numValue = value.replace(/[^0-9.]/g, "");
    const parts = numValue.split(".");
    if (parts[1] && parts[1].length > 3) {
      parts[1] = parts[1].slice(0, 3);
    }
    const formattedValue = parts.join(".");
    setCustomAmountRange((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const formatAmount = (value) => {
    if (!value) return "";
    const num = parseFloat(value);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCustomAmountSearch = () => {
    if (customAmountRange.from && customAmountRange.to) {
      setAmountFilter("Custom");
      setShowAmountOptions(false); // Close the dropdown after selection
    }
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
              <button onClick={() => handleDateOptionClick("Last 15 days")}>
                Last 15 days
              </button>
              <button onClick={() => handleDateOptionClick("Last 30 days")}>
                Last 30 days
              </button>
              <button onClick={() => handleDateOptionClick("Last 12 months")}>
                Last 12 months
              </button>
              <button onClick={() => handleDateOptionClick("All")}>All</button>
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
                <button onClick={handleCustomDateSearchWrapper}>View</button>
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
              <button onClick={() => handleAmountOptionClick("All")}>
                All
              </button>
              <button onClick={() => handleAmountOptionClick("0-100")}>
                $0 - $100
              </button>
              <button onClick={() => handleAmountOptionClick("101-500")}>
                $101 - $500
              </button>
              <button onClick={() => handleAmountOptionClick("501-1000")}>
                $501 - $1000
              </button>
              <button onClick={() => handleAmountOptionClick("1001+")}>
                $1001+
              </button>
              <div className="custom-amount-range">
                <div>
                  <label>From:</label>
                  <span className="dollar-sign">$</span>
                  <input
                    type="text"
                    value={customAmountRange.from}
                    onChange={(e) =>
                      handleCustomAmountChange("from", e.target.value)
                    }
                    onBlur={() =>
                      setCustomAmountRange((prev) => ({
                        ...prev,
                        from: formatAmount(prev.from),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label>To:</label>
                  <span className="dollar-sign">$</span>
                  <input
                    type="text"
                    value={customAmountRange.to}
                    onChange={(e) =>
                      handleCustomAmountChange("to", e.target.value)
                    }
                    onBlur={() =>
                      setCustomAmountRange((prev) => ({
                        ...prev,
                        to: formatAmount(prev.to),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="custom-amount-buttons">
                  <button onClick={handleCustomAmountSearch}>View</button>
                  <button
                    onClick={() => {
                      setCustomAmountRange({ from: "", to: "" });
                      setAmountFilter("Amount range");
                    }}
                  >
                    Clear
                  </button>
                </div>
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
      {filteredTransactions.length > 0 ? (
        <TransactionTable
          transactions={filteredTransactions}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
      ) : (
        <div className="no-transactions">No transactions found</div>
      )}
    </div>
  );
};

export default HistoryPage;
