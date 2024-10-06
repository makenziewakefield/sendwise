import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [dateFilter, setDateFilter] = useState("Last 15 days");
  const [amountFilter, setAmountFilter] = useState("Amount range");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showAmountDropdown, setShowAmountDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });
  const [customAmountRange, setCustomAmountRange] = useState({
    from: "",
    to: "",
  });
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const userId = "1"; // Replace with actual user ID
      const response = await axios.get(
        `http://localhost:8080/api/v1/transactions/user/${userId}`
      );
      const transfersResponse = await axios.get(
        `http://localhost:8080/api/v1/transfers/${userId}`
      );

      const allTransactions = [
        ...response.data.map((t) => ({
          ...t,
          type: "transaction",
          date: new Date(t.date),
        })),
        ...transfersResponse.data.map((t) => ({
          ...t,
          type: "transfer",
          category: "Transfer",
          date: new Date(t.date),
        })),
      ];

      const sortedTransactions = allTransactions.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      let runningBalance = 0;
      const transactionsWithBalance = sortedTransactions.map((t) => {
        if (t.type === "transaction") {
          runningBalance += t.is_incoming ? t.amount : -t.amount;
        } else if (t.type === "transfer") {
          runningBalance += t.sender_id === userId ? -t.amount : t.amount;
        }
        return { ...t, balance: runningBalance };
      });

      setTransactions(transactionsWithBalance);
      setBalance(runningBalance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDateFilter = (filter) => {
    setDateFilter(filter);
    setShowDateDropdown(false);
  };

  const handleAmountFilter = (filter) => {
    setAmountFilter(filter);
    setShowAmountDropdown(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDateFilter =
      dateFilter === "All" ||
      (dateFilter === "Last 15 days" &&
        t.date >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "Last 30 days" &&
        t.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "Last 12 months" &&
        t.date >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "Custom" &&
        t.date >= new Date(customDateRange.from) &&
        t.date <= new Date(customDateRange.to));
    const matchesAmountFilter =
      amountFilter === "All" ||
      (amountFilter === "$0-100" && t.amount >= 0 && t.amount <= 100) ||
      (amountFilter === "$100-$500" && t.amount > 100 && t.amount <= 500) ||
      (amountFilter === "$501-$1,000" && t.amount > 500 && t.amount <= 1000) ||
      (amountFilter === "$1,001+" && t.amount > 1000) ||
      (amountFilter === "Custom" &&
        t.amount >= parseFloat(customAmountRange.from) &&
        t.amount <= parseFloat(customAmountRange.to));
    return matchesSearch && matchesDateFilter && matchesAmountFilter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
    if (sortColumn === "amount") {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortColumn === "balance") {
      return sortDirection === "asc"
        ? a.balance - b.balance
        : b.balance - a.balance;
    }
    return 0;
  });

  return (
    <div className="history-page">
      <h1>Transaction History</h1>
      <h2>Your Balance: ${balance.toFixed(2)}</h2>

      <div className="filters">
        <div className="dropdown">
          <button onClick={() => setShowDateDropdown(!showDateDropdown)}>
            {dateFilter} <FaChevronDown />
          </button>
          {showDateDropdown && (
            <div className="dropdown-content">
              <button onClick={() => handleDateFilter("Last 15 days")}>
                Last 15 days
              </button>
              <button onClick={() => handleDateFilter("Last 30 days")}>
                Last 30 days
              </button>
              <button onClick={() => handleDateFilter("Last 12 months")}>
                Last 12 months
              </button>
              <button onClick={() => handleDateFilter("All")}>All</button>
              <div>
                <input
                  type="date"
                  placeholder="From"
                  value={customDateRange.from}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      from: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  placeholder="To"
                  value={customDateRange.to}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      to: e.target.value,
                    })
                  }
                />
                <button onClick={() => handleDateFilter("Custom")}>
                  Apply
                </button>
              </div>
              <button onClick={() => setCustomDateRange({ from: "", to: "" })}>
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button onClick={() => setShowAmountDropdown(!showAmountDropdown)}>
            {amountFilter} <FaChevronDown />
          </button>
          {showAmountDropdown && (
            <div className="dropdown-content">
              <button onClick={() => handleAmountFilter("All")}>All</button>
              <button onClick={() => handleAmountFilter("$0-100")}>
                $0-100
              </button>
              <button onClick={() => handleAmountFilter("$100-$500")}>
                $100-$500
              </button>
              <button onClick={() => handleAmountFilter("$501-$1,000")}>
                $501-$1,000
              </button>
              <button onClick={() => handleAmountFilter("$1,001+")}>
                $1,001+
              </button>
              <div>
                <input
                  type="number"
                  placeholder="From"
                  value={customAmountRange.from}
                  onChange={(e) =>
                    setCustomAmountRange({
                      ...customAmountRange,
                      from: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="To"
                  value={customAmountRange.to}
                  onChange={(e) =>
                    setCustomAmountRange({
                      ...customAmountRange,
                      to: e.target.value,
                    })
                  }
                />
                <button onClick={() => handleAmountFilter("Custom")}>
                  Apply
                </button>
              </div>
              <button
                onClick={() => setCustomAmountRange({ from: "", to: "" })}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search by description"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search">
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>
              Date{" "}
              {sortColumn === "date" &&
                (sortDirection === "asc" ? <FaChevronUp /> : <FaChevronDown />)}
            </th>
            <th>Description</th>
            <th>Category</th>
            <th onClick={() => handleSort("amount")}>
              Amount In{" "}
              {sortColumn === "amount" &&
                (sortDirection === "asc" ? <FaChevronUp /> : <FaChevronDown />)}
            </th>
            <th onClick={() => handleSort("amount")}>
              Amount Out{" "}
              {sortColumn === "amount" &&
                (sortDirection === "asc" ? <FaChevronUp /> : <FaChevronDown />)}
            </th>
            <th onClick={() => handleSort("balance")}>
              Balance{" "}
              {sortColumn === "balance" &&
                (sortDirection === "asc" ? <FaChevronUp /> : <FaChevronDown />)}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((t, index) => (
            <tr key={index}>
              <td>{format(t.date, "MM/dd/yyyy")}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>
                {t.is_incoming ||
                (t.type === "transfer" && t.recipient_id === "1")
                  ? `$${t.amount.toFixed(2)}`
                  : "-"}
              </td>
              <td>
                {!t.is_incoming ||
                (t.type === "transfer" && t.sender_id === "1")
                  ? `$${t.amount.toFixed(2)}`
                  : "-"}
              </td>
              <td>${t.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
