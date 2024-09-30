import React, { useState, useEffect } from "react";
import ContactsTable from "../components/ContactsTable";
import useContacts from "../hooks/useContacts";
import "../styles/Contacts.scss";

const ContactsPage = () => {
  const { contacts, fetchContacts, updateContact, deleteContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_nickname: ''
  });

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
    // Implement additional logic to handle sending money
  };

  // Handle form submission for adding a contact
  const handleAddContact = async () => {
    if (!newContact.contact_name || !newContact.contact_email || !newContact.contact_phone) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: "1",
          contact_name: newContact.contact_name,
          contact_email: newContact.contact_email,
          contact_phone: newContact.contact_phone,
          contact_nickname: newContact.contact_nickname,
        }),
      });

      if (response.ok) {
        const addedContact = await response.json();

        fetchContacts();

        setNewContact({ contact_name: '', contact_email: '', contact_phone: '', contact_nickname: '' });
        setShowAddContactForm(false);
      } else {
        console.error('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    await deleteContact(id);
  };

  return (
    <div className="contacts-page">
      <div className="page-top-container">
        <h2>Contacts</h2>

        {/* Search contacts */}
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search contacts"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <ContactsTable
        contacts={filteredContacts}
        onSendMoney={handleSendMoney}
        onViewHistory={handleViewHistory}
        onDeleteContact={handleDeleteContact}
      />

      {/* Add Contact Button */}
      {!showAddContactForm && (
        <button className="add-contact-buttons" onClick={() => setShowAddContactForm(true)}>
          Add Contact
        </button>
      )}

      {/* New Contact Form */}
      {showAddContactForm && (
        <div className="add-contact-form">
          <h3>Add New Contact</h3>
          <input
            type="text"
            placeholder="Name"
            value={newContact.contact_name}
            onChange={e => setNewContact({ ...newContact, contact_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newContact.contact_email}
            onChange={e => setNewContact({ ...newContact, contact_email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newContact.contact_phone}
            onChange={e => setNewContact({ ...newContact, contact_phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nickname"
            value={newContact.contact_nickname}
            onChange={e => setNewContact({ ...newContact, contact_nickname: e.target.value })}
          />
          <div className="add-contact-buttons">
            <button onClick={handleAddContact}>Submit</button>
            <button onClick={() => setShowAddContactForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
