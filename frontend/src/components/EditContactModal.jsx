import React from "react";

const EditContactModal = ({ isOpen, onClose, contact, onSave }) => {
  const [updatedContact, setUpdatedContact] = React.useState(contact || {
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_nickname: ''
  });

  React.useEffect(() => {
    setUpdatedContact(contact || {
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      contact_nickname: ''
    });
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedContact);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Contact</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="contact_name"
            placeholder="Name"
            value={updatedContact.contact_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="contact_email"
            placeholder="Email"
            value={updatedContact.contact_email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact_phone"
            placeholder="Phone"
            value={updatedContact.contact_phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact_nickname"
            placeholder="Nickname"
            value={updatedContact.contact_nickname}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
