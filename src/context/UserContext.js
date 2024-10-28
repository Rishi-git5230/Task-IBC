import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to log request details
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request', {
    method: request.method,
    url: request.url,
    data: request.data,
  });
  return request; // Important: Return the request object to continue the request
});

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch deleted users from API
  const fetchDeletedUsers = async () => {
    try {
      const response = await axiosInstance.get('/deleted-users');
      setDeletedUsers(response.data);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
    }
  };

  // Add a new user
  const addUser = async (firstName, lastName, dob, gender, email, fullAddress, mobile, userStatus) => {
    if (!firstName || !lastName || !dob || !gender || !email || !fullAddress || !mobile) {
      console.error('All fields must be filled out');
      return;
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      dob,
      gender,
      email,
      full_address: fullAddress,
      mobile,
      user_status: userStatus || "Active",
    };

    console.log('User data being sent:', userData);

    try {
      const response = await axiosInstance.post('/users', userData);
      setUsers(prevUsers => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Other functions (updateUser, deleteUser, etc.) go here...

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  return (
    <UserContext.Provider value={{
      users,
      deletedUsers,
      addUser,
      // Other context values...
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
