import { useState, useEffect } from 'react';

const useContacts = () => {
  const [contacts, setContacts] = useState([]);

  // Fetch contacts from an API
  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Add a new contact to the list
  const addContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  // Update existing contact
  const updateContact = async (contactId, updatedContact) => {
    console.log('Updating contact:', contactId, updatedContact);
    
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
        // Update state with the modified contact
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


  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, fetchContacts, addContact, updateContact, deleteContact };
}

export default useContacts;
