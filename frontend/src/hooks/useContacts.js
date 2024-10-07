import { useState, useEffect } from "react";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  // Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/v1/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Function to update a contact
  const updateContact = async (id, updatedContact) => {
    try {
      const response = await fetch(`/api/v1/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      });

      if (response.ok) {
        const updatedContacts = contacts.map(contact =>
          contact.id === id ? updatedContact : contact
        );
        setContacts(updatedContacts);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  // Function to delete a contact
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`/api/v1/contacts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const filteredContacts = contacts.filter(contact => contact.id !== id);
        setContacts(filteredContacts);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Fetch contacts on initial render
  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    fetchContacts,
    updateContact,
    deleteContact,
  };
};

export default useContacts;