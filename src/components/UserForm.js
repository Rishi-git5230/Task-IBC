import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose, onEdit }) => {
  const { addUser, updateUser, fetchUsers } = useUserContext(); // Get fetchUsers from context
  
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
    } else {
      // Reset form if not editing
      setFirstName('');
      setLastName('');
      setDob('');
      setGender('Male');
      setEmail('');
      setFullAddress('');
      setMobile('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const userPayload = {
      first_name: firstName,
      last_name: lastName,
      dob,
      gender,
      email,
      full_address: fullAddress,
      mobile,
    };

    try {
      if (user) {
        // Update existing user
        await updateUser(user.id, userPayload);
        onEdit({ ...userPayload, id: user.id });
      } else {
        // Add new user
        await addUser(firstName, lastName, dob, gender, email, fullAddress, mobile);
        console.log('User added:', userPayload);
      }
      // Fetch updated user list after adding or updating
      fetchUsers();
      // Close the form after submission
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      // Optionally display an error message
    }
  };

  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    // Prevent selecting future dates
    if (selectedDate > today) {
      alert("You cannot select a future date.");
      return;
    }
    setDob(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          placeholder="First Name" 
          required 
        />
      </div>
      <div>
        <label>Last Name</label>
        <input 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          placeholder="Last Name" 
          required 
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input 
          type="date" 
          value={dob} 
          onChange={handleDobChange} 
          required 
        />
      </div>
      <div>
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
      </div>
      <div>
        <label>Full Address</label>
        <textarea 
          value={fullAddress} 
          onChange={(e) => setFullAddress(e.target.value)} 
          placeholder="Full Address" 
          required 
        />
      </div>
      <div>
        <label>Mobile</label>
        <input 
          type="tel" 
          value={mobile} 
          onChange={(e) => setMobile(e.target.value)} 
          placeholder="Mobile" 
          required 
        />
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
