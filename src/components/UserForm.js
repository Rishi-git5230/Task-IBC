import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose, onEdit }) => {
  const { addUser, updateUser, fetchUsers } = useUserContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setDob(user.dob);
      setGender(user.gender);
      setEmail(user.email);
      setFullAddress(user.full_address);
      setMobile(user.mobile.replace(/^\+\d+/, '')); // Remove country code for display
      setCountryCode('+91'); // Default country code
    } else {
      setFirstName('');
      setLastName('');
      setDob('');
      setGender('Male');
      setEmail('');
      setFullAddress('');
      setMobile('');
      setCountryCode('+91');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const userPayload = {
      first_name: firstName,
      last_name: lastName,
      dob,
      gender,
      email,
      full_address: fullAddress,
      mobile: `${countryCode}${mobile}`, // Combine country code with mobile
    };

    try {
      if (user) {
        await updateUser(user.id, userPayload);
        onEdit({ ...userPayload, id: user.id });
      } else {
        await addUser(firstName, lastName, dob, gender, email, fullAddress, mobile);
        console.log('User added:', userPayload);
      }
      fetchUsers();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/; // Allow alphabets and spaces
    const mobileRegex = /^\d{10}$/;

    if (!nameRegex.test(firstName) || firstName.length > 50) {
      alert("First Name must contain only alphabets and spaces and be less than 50 characters.");
      return false;
    }

    if (!nameRegex.test(lastName) || lastName.length > 50) {
      alert("Last Name must contain only alphabets and spaces and be less than 50 characters.");
      return false;
    }

    // Validate that the email contains "@" character
    if (!email.includes('@')) {
      alert("Email must contain '@'.");
      return false;
    }

    if (fullAddress.length > 100) {
      alert("Full Address must be less than 100 characters.");
      return false;
    }

    if (!mobileRegex.test(mobile)) {
      alert("Mobile number must contain exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (selectedDate > today) {
      alert("You cannot select a future date.");
      return;
    }
    setDob(e.target.value);
  };

  const handleMobileChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (input.length <= 10) { // Allow a maximum of 10 digits
      setMobile(input);
    }
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
        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
          <option value="+91">+91 (India)</option>
          <option value="+1">+1 (USA)</option>
          <option value="+44">+44 (UK)</option>
          {/* Add more country codes as needed */}
        </select>
        <input 
          type="tel" 
          value={mobile} 
          onChange={handleMobileChange} 
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
