// src/components/TransactionTable.jsx
import React from "react";
import { sortTransactions } from "../utils/sortUtils";

const TransactionTable = ({ transactions, sortConfig, requestSort }) => {
  const sortedTransactions = sortTransactions(transactions, sortConfig);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
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
            Category {getClassNamesFor("category") === "ascending" ? "▲" : "▼"}
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
  );
};

export default TransactionTable;
