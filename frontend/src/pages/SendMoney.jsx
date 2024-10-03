import React, { useState, useEffect } from "react";
import "../styles/SendMoney.scss";
import useContacts from "../hooks/useContacts";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";

const SendMoney = () => {
  const { contacts, addNewContact } = useContacts();
  const [recipient, setRecipient] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank");
  const [description, setDescription] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to send money.");
      return;
    }

    if (isAddingContact) {
      try {
        const newContact = await addNewContact(newContactName);
        setRecipient(newContact.id);
      } catch (error) {
        console.error("Error adding new contact:", error);
        return;
      }
    }

    const data = {
      senderId: 1, // You might want to get this from the token or user context
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

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page
      window.location.href = "/login";
    }
  };

  // Call this function when the component mounts
  React.useEffect(() => {
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
              <input
                type="text"
                id="new-contact"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Enter new contact name"
                required
              />
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
    </div>
  );
};

export default SendMoney;
