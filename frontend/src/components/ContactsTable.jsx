import React from "react";

const ContactsTable = ({ 
  contacts, 
  editingContact, 
  onEditContact, 
  onCancelEdit, 
  onUpdateContact, 
  onSendMoney, 
  onDeleteContact, 
  handleChange }) => {
    
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
        {contacts.map((contact) => (
          <tr key={contact.id}>
            {editingContact && editingContact.id === contact.id ? (
              <td colSpan={5}>
                <div className="add-contact-form">
                  <input
                    type="text"
                    value={editingContact.contact_name}
                    onChange={(e) => handleChange("contact_name", e.target.value)}
                  />
                  <input
                    type="text"
                    value={editingContact.contact_nickname}
                    onChange={(e) => handleChange("contact_nickname", e.target.value)}
                  />
                  <input
                    type="email"
                    value={editingContact.contact_email}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                  />
                  <input
                    type="tel"
                    value={editingContact.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                  />
                  <div className="edit-actions">
                    <button className="save-button" onClick={() => onUpdateContact()}>Save</button>
                    <button className="cancel-button" onClick={() => onCancelEdit()}>Cancel</button>
                  </div>
                </div>
              </td>
            ) : (
              <>
                <td>{contact.contact_name}</td>
                <td>{contact.contact_nickname}</td>
                <td>{contact.contact_email}</td>
                <td>{contact.contact_phone}</td>
                <td className="button-container">
                  <button onClick={() => onSendMoney(contact)}>Send Money</button>
                  <button onClick={() => onEditContact(contact)}>Edit</button>
                  <button onClick={() => onDeleteContact(contact.id)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsTable;
