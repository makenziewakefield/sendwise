import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState("Last 15 days");
  const [amountFilter, setAmountFilter] = useState("Amount range");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/v1/history", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const sortedTransactions = React.useMemo(() => {
    let sortableTransactions = [...transactions];
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
  }, [transactions, sortConfig]);

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

  return (
    <div>
      <h1>Transaction History</h1>
      <div>
        <button>{dateFilter} ▼</button>
        <button>{amountFilter} ▼</button>
        <input
          type="text"
          placeholder="Search by description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <button onClick={() => setSearchTerm("")}>✕</button>}
      </div>
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
              Balance {getClassNamesFor("balance") === "ascending" ? "▲" : "▼"}
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
    </div>
  );
};

export default HistoryPage;