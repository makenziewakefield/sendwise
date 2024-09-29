import React from "react";

const ContactsTable = ({ contacts, onSendMoney, onRequestMoney, onViewHistory }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.contact_name}</td>
            <td>{contact.contact_email}</td>
            <td>{contact.contact_phone}</td>
            <td className="button-container">
              <button onClick={() => onSendMoney(contact)}>Send Money</button>
              <button onClick={() => onRequestMoney(contact)}>Request Money</button>
              <button onClick={() => onViewHistory(contact)}>View History</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsTable;
