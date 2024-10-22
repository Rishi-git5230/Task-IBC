import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose }) => {
  const { addUser, updateUser } = useUserContext();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [mobile, setMobile] = useState('');

  // Populate form fields if editing a user
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setDob(user.dob);
      setGender(user.gender);
      setEmail(user.email);
      setFullAddress(user.full_address);
      setMobile(user.mobile);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await updateUser(user.id, firstName, lastName, dob, gender, email, fullAddress, mobile);
    } else {
      await addUser(firstName, lastName, dob, gender, email, fullAddress, mobile);
    }
    onClose(); // Close the form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <textarea value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="Full Address" required />
      <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" required />
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
