import { useState, useEffect, useCallback } from 'react';

const useContacts = (userId) => {
  const [contacts, setContacts] = useState([]);

  // Function to fetch contacts for a specific user
  const fetchContacts = useCallback(async (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/v1/contacts/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched contacts:", data);
        setContacts(data);
      } else {
        console.error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, []);

  // Add a new contact to the list
  const addContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  // Update existing contact
  const updateContact = async (contactId, updatedContact) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact),
      });
  
      if (response.ok) {
        const updatedContactData = await response.json();
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === contactId ? updatedContactData : contact
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to update contact:', errorData);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prevContacts =>
          prevContacts.filter(contact => contact.id !== contactId)
        );
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Effect to fetch contacts when userId changes
  useEffect(() => {
    if (userId) {
      fetchContacts(userId);
    }
  }, [userId, fetchContacts]);

  return { contacts, fetchContacts, addContact, updateContact, deleteContact };
}

export default useContacts;
