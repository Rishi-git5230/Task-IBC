import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose }) => {
  const { addUser, updateUser } = useUserContext();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await updateUser(user.id, name, email);
    } else {
      await addUser(name, email);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
