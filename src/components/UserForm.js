import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserForm = ({ user, onClose, onEdit }) => {
  const { addUser, updateUser, fetchUsers } = useUserContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('None'); // Default gender is set to 'None'
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    fullAddress: '',
    mobile: ''
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setDob(user.dob);
      setGender(user.gender || 'None'); // Ensure user data sets the gender correctly
      setEmail(user.email);
      setFullAddress(user.full_address);
      setMobile(user.mobile.replace(/^\+\d+/, '')); // Remove country code for display
      setCountryCode('+91'); // Default country code
    } else {
      setFirstName('');
      setLastName('');
      setDob('');
      setGender('None'); // Default gender is 'None'
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
    let valid = true;
    let newErrors = {};

    // First Name Validation
    if (!firstName) {
      newErrors.firstName = 'First Name is required.';
      valid = false;
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'First Name must contain only alphabets and spaces.';
      valid = false;
    } else if (firstName.length > 50) {
      newErrors.firstName = 'First Name must be less than or equal to 50 characters.';
      valid = false;
    }

    // Last Name Validation
    if (!lastName) {
      newErrors.lastName = 'Last Name is required.';
      valid = false;
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Last Name must contain only alphabets and spaces.';
      valid = false;
    } else if (lastName.length > 50) {
      newErrors.lastName = 'Last Name must be less than or equal to 50 characters.';
      valid = false;
    }

    // Date of Birth Validation
    if (!dob) {
      newErrors.dob = 'Date of Birth is required.';
      valid = false;
    } else {
      const selectedDate = new Date(dob);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dob = 'You cannot select a future date.';
        valid = false;
      }
    }

    // Gender Validation
    if (gender === 'None') {
      newErrors.gender = 'Gender is required.';
      valid = false;
    }

    // Email Validation
    if (!email) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Valid email is required.';
      valid = false;
    }

    // Full Address Validation
    if (!fullAddress) {
      newErrors.fullAddress = 'Full Address is required.';
      valid = false;
    } else if (fullAddress.length > 100) {
      newErrors.fullAddress = 'Full Address must be less than 100 characters.';
      valid = false;
    }

    // Mobile Validation
    if (!mobileRegex.test(mobile)) {
      newErrors.mobile = 'Mobile number must contain exactly 10 digits.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (selectedDate > today) {
      setErrors((prev) => ({ ...prev, dob: "You cannot select a future date." }));
    } else {
      setDob(e.target.value);
      setErrors((prev) => ({ ...prev, dob: '' }));
    }
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
          style={{ borderColor: errors.firstName ? 'red' : '' }}
        />
        {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
      </div>
      
      <div>
        <label>Last Name</label>
        <input 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          placeholder="Last Name" 
          style={{ borderColor: errors.lastName ? 'red' : '' }}
        />
        {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
      </div>

      <div>
        <label>Date of Birth</label>
        <input 
          type="date" 
          value={dob} 
          onChange={handleDobChange} 
          style={{ borderColor: errors.dob ? 'red' : '' }}
        />
        {errors.dob && <p style={{ color: 'red' }}>{errors.dob}</p>}
      </div>

      <div>
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="None">None</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
      </div>

      <div>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          style={{ borderColor: errors.email ? 'red' : '' }}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <label>Full Address</label>
        <textarea 
          value={fullAddress} 
          onChange={(e) => setFullAddress(e.target.value)} 
          placeholder="Full Address" 
          style={{ borderColor: errors.fullAddress ? 'red' : '' }}
        />
        {errors.fullAddress && <p style={{ color: 'red' }}>{errors.fullAddress}</p>}
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
          style={{ borderColor: errors.mobile ? 'red' : '' }}
        />
        {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;



