import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch deleted users from API
  const fetchDeletedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deleted-users');
      setDeletedUsers(response.data);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
    }
  };

  // Add a new user
  const addUser = async (firstName, lastName, dob, gender, email, fullAddress, mobile) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users', { 
        first_name: firstName,
        last_name: lastName,
        dob,
        gender,
        email,
        full_address: fullAddress,
        mobile,
      });
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update a user
  const updateUser = async (id, firstName, lastName, dob, gender, email, fullAddress, mobile) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${id}`, { 
        first_name: firstName,
        last_name: lastName,
        dob,
        gender,
        email,
        full_address: fullAddress,
        mobile,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? response.data : user))
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Soft delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Enable a deleted user
  const enableUser = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/enable/${id}`);
      fetchDeletedUsers(); // Refresh deleted users
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  };

  // Bulk delete users
  const bulkDeleteUsers = async (ids) => {
    try {
      await axios.delete('http://localhost:5000/api/users/bulk-delete', { data: { ids } });
      fetchUsers(); // Refresh users
    } catch (error) {
      console.error('Error bulk deleting users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  return (
    <UserContext.Provider value={{
      users,
      deletedUsers,
      addUser,
      updateUser,
      deleteUser,
      enableUser,
      bulkDeleteUsers,
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
