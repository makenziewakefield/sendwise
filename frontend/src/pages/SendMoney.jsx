import React, { useState, useEffect } from "react";
import "../styles/SendMoney.scss";
import useContacts from "../hooks/useContacts";
import { getUserIdFromToken } from "../utils/tokenUtils";
import axios from "axios";

const SendMoney = () => {
  const { contacts, addNewContact } = useContacts();
  const [recipient, setRecipient] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactDetails, setNewContactDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank");
  const [description, setDescription] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [error, setError] = useState("");

  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmountIn, setTransactionAmountIn] = useState(0);
  const [transactionAmountOut, setTransactionAmountOut] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  // Function to verify if the contact exists
  const verifyNewContact = async () => {
    try {
      const response = await axios.get(`/api/users?username=${newContactName}`);
      if (response.data) {
        setNewContactDetails(response.data);
        setError("");
      } else {
        setNewContactDetails(null);
        setError("User not found. Please enter a valid username.");
      }
    } catch (error) {
      setNewContactDetails(null);
      setError("Error fetching user. Please try again.");
    }
  };

  // Function to handle adding the new contact after confirmation
  const confirmAddNewContact = async () => {
    if (!newContactDetails) return;
    try {
      const newContact = await addNewContact(newContactDetails.username);
      setRecipient(newContact.id);
      setIsAddingContact(false);
      setNewContactName("");
      setError("");
    } catch (error) {
      setError("Failed to add contact. Please try again.");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to send money.");
      return;
    }

    if (isAddingContact && !newContactDetails) {
      alert("Please confirm the new contact before proceeding.");
      return;
    }

    const data = {
      senderId: 1,
      recipientId: recipient,
      amount,
      method,
      description,
    };

    try {
      await axios.post("/api/transfers", data);
      alert("Money sent successfully!");
    } catch (error) {
      console.error("Error sending money:", error);
      alert("Failed to send money. Please try again.");
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
  
    const transactionData = {
      userId: userId, 
      category: transactionCategory,
      amount_in: transactionAmountIn,
      amount_out: transactionAmountOut,
      description: transactionDescription,
      date: transactionDate,
    };
  
    try {
      await axios.post("/api/v1/transactions", transactionData);
      alert("Transaction logged successfully!");
  
      setTransactionCategory("");
      setTransactionAmountIn(0);
      setTransactionAmountOut(0);
      setTransactionDescription("");
      setTransactionDate("");
    } catch (error) {
      console.error("Error logging transaction:", error);
      alert("Failed to log transaction. Please try again.");
    }
  };

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  };

  // Call this function when the component mounts
  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="send-money-container">
      <h2>Send Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-field">
            <label htmlFor="recipient">Recipient</label>
            {isAddingContact ? (
              <>
                <input
                  type="text"
                  id="new-contact"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Enter new contact username"
                  required
                />
                <button type="button" onClick={verifyNewContact}>
                  Verify Contact
                </button>
                {newContactDetails && (
                  <div className="confirmation">
                    <p>Is this the contact you want to add?</p>
                    <p>
                      {newContactDetails.first_name}{" "}
                      {newContactDetails.last_name}
                    </p>
                    <button type="button" onClick={confirmAddNewContact}>
                      Confirm and Add
                    </button>
                  </div>
                )}
                {error && <div className="error-message">{error}</div>}
              </>
            ) : (
              <select
                id="recipient"
                value={recipient}
                onChange={(e) => {
                  if (e.target.value === "add-new") {
                    setIsAddingContact(true);
                  } else {
                    setRecipient(e.target.value);
                    setIsAddingContact(false);
                  }
                }}
              >
                <option value="" disabled>
                  Select a contact
                </option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
                <option value="add-new">Add New Contact</option>
              </select>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label htmlFor="method">Method</label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note (optional)"
            />
          </div>
        </div>

        <div className="row buttons">
          <button type="button" className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="send-btn">
            Send
          </button>
        </div>
      </form>

      <h2>Log a Transaction</h2>
      <form onSubmit={handleTransactionSubmit}>
        <div className="row">
          <div className="input-field">
            <label htmlFor="transaction-category">Category</label>
            <input
              type="text"
              id="transaction-category"
              value={transactionCategory}
              onChange={(e) => setTransactionCategory(e.target.value)}
              placeholder="Enter transaction category"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="transaction-amount-in">Amount In</label>
            <input
              type="number"
              id="transaction-amount-in"
              value={transactionAmountIn}
              onChange={(e) => setTransactionAmountIn(e.target.value)}
              placeholder="Enter amount in"
            />
          </div>

          <div className="input-field">
            <label htmlFor="transaction-amount-out">Amount Out</label>
            <input
              type="number"
              id="transaction-amount-out"
              value={transactionAmountOut}
              onChange={(e) => setTransactionAmountOut(e.target.value)}
              placeholder="Enter amount out"
            />
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label htmlFor="transaction-description">Description</label>
            <textarea
              id="transaction-description"
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
              placeholder="Enter transaction description"
            />
          </div>

          <div className="input-field">
            <label htmlFor="transaction-date">Date</label>
            <input
              type="date"
              id="transaction-date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row buttons">
          <button type="submit" className="send-btn">
            Log Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMoney;