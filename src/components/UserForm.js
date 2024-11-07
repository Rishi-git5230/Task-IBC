import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';

const UserForm = ({ user, onClose, onEdit }) => {
  const [formData, setFormData] = useState(user || {
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    email: '',
    full_address: '',
    mobile: '',
    user_status: 'Active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?email=${email}`);
      return response.data.length > 0; // If the response has any users, the email already exists
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email already exists
    const emailExists = await checkEmailExists(formData.email);
    
    if (emailExists) {
      // Show a SweetAlert message if email already exists
      Swal.fire({
        icon: 'error',
        title: 'Email Already Exists',
        text: 'The email address you entered is already registered. Please use a different email.',
      });
      return; // Prevent form submission if email exists
    }

    // If email doesn't exist, proceed with user addition or edit
    if (user) {
      // If editing an existing user, call the onEdit function
      onEdit(formData);
    } else {
      // Otherwise, add the new user
      try {
        await axios.post('http://localhost:5000/api/users', formData);
        onClose(); // Close the form after successful submit
      } catch (error) {
        console.error("Error adding user:", error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add User',
          text: 'There was an error while adding the user. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div className="form-group">
        <label>Full Address</label>
        <textarea
          name="full_address"
          value={formData.full_address}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label>Mobile</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>User Status</label>
        <select
          name="user_status"
          value={formData.user_status}
          onChange={handleInputChange}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default UserForm;
