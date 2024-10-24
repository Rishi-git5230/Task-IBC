import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose, onEdit }) => {
  const { addUser, updateUser } = useUserContext();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [userStatus, setUserStatus] = useState('Active'); // Default status

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
      setUserStatus(user.user_status); // Set user status for editing
    } else {
      // Reset form if not editing
      setFirstName('');
      setLastName('');
      setDob('');
      setGender('Male');
      setEmail('');
      setFullAddress('');
      setMobile('');
      setUserStatus('Active');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      id: user ? user.id : null, // Set ID only when editing
      first_name: firstName,
      last_name: lastName,
      dob,
      gender,
      email,
      full_address: fullAddress,
      mobile,
      user_status: userStatus,
    };

    try {
      if (user) {
        await updateUser(updatedUser.id, updatedUser);
        onEdit(updatedUser); // Call onEdit with the updated user
      } else {
        await addUser(updatedUser); // Call addUser when creating a new user
        // Handle addition logic if needed
      }
       // Close the form after submission
    } catch (error) {
      console.error("Error saving user:", error);
      // Optionally handle error state here (e.g., set error message in state)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
        placeholder="First Name" 
        required 
      />
      <input 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
        placeholder="Last Name" 
        required 
      />
      <input 
        type="date" 
        value={dob} 
        onChange={(e) => setDob(e.target.value)} 
        required 
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <textarea 
        value={fullAddress} 
        onChange={(e) => setFullAddress(e.target.value)} 
        placeholder="Full Address" 
        required 
      />
      <input 
        value={mobile} 
        onChange={(e) => setMobile(e.target.value)} 
        placeholder="Mobile" 
        required 
      />
      
      {/* User Status Select */}
      <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} required>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
