import React, { useState, useEffect } from "react";
import ContactsTable from "../components/ContactsTable";
import useContacts from "../hooks/useContacts";
import "../styles/Contacts.scss";

const ContactsPage = () => {
  const { contacts, fetchContacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name && contact.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHistory = (contact) => {
    // Implement logic to view transaction history
  };

  const handleSendMoney = (contact) => {
    console.log(`Sending money to ${contact.contact_name}`);
    // Implement additional logic to handle sending money
  };

  const handleRequestMoney = (contact) => {
    console.log(`Requesting money from ${contact.contact_name}`);
    // Implement additional logic to handle requesting money
  };

  return (
    <div className="contacts-page">
      <h2>Contacts</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search contacts"
        />
      </div>
      <ContactsTable
        contacts={filteredContacts}
        onSendMoney={handleSendMoney}
        onRequestMoney={handleRequestMoney}
        onViewHistory={handleViewHistory}
      />
    </div>
  );

};

export default ContactsPage;
