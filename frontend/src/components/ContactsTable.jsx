import React from "react";

const ContactsTable = ({ contacts, onSendMoney, onViewHistory, onDeleteContact }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Nickname</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td>{contact.contact_name}</td>
            <td>{contact.contact_nickname}</td>
            <td>{contact.contact_email}</td>
            <td>{contact.contact_phone}</td>
            <td className="button-container">
              <button onClick={() => onSendMoney(contact)}>Send Money</button>
              <button onClick={() => onViewHistory(contact)}>View History</button>
              <button onClick={() => onDeleteContact(contact.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsTable;
