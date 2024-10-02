import React, { useState } from "react";
import "../styles/SendMoney.scss";
import useContacts from "../hooks/useContacts";
import axios from "axios";

const SendMoney = () => {
  const { contacts, addNewContact } = useContacts();
  const [recipient, setRecipient] = useState("");
  const [newContactName, setNewContactName] = useState(""); // State for new contact name
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank");
  const [description, setDescription] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false); // Manage add contact state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If adding a new contact, handle the creation of the contact first
    if (isAddingContact) {
      try {
        const newContact = await addNewContact(newContactName); // Assume addNewContact adds the contact and returns it
        setRecipient(newContact.id); // Set the recipient to the new contact's ID
      } catch (error) {
        console.error("Error adding new contact:", error);
        return; // Exit early if adding the contact fails
      }
    }

    // Prepare data for money transfer
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
    }
  };

  return (
    <div className="send-money-container">
      <h2>Send Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-field">
            <label htmlFor="recipient">Recipient</label>
            {isAddingContact ? (
              // Show input for new contact if "Add New" is selected
              <input
                type="text"
                id="new-contact"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="Enter new contact name"
                required
              />
            ) : (
              // Show dropdown if not adding a new contact
              <select
                id="recipient"
                value={recipient}
                onChange={(e) => {
                  if (e.target.value === "add-new") {
                    setIsAddingContact(true); // Switch to adding a new contact
                  } else {
                    setRecipient(e.target.value); // Set the recipient normally
                    setIsAddingContact(false); // Ensure the form goes back to normal if needed
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
