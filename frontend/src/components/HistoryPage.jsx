import React, { useState, useEffect } from "react";
// import axios from "axios";
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

  useEffect(() => {
    // Simulating API call with mock data
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sorting and filtering logic
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
        <button>{dateFilter} ▼</button>
        <button>{amountFilter} ▼</button>
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