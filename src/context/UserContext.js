import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  return request;
});

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users');
      console.log("fetchUsers func was called");
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []); // Dependency array is empty, function reference won't change

  // Fetch deleted users from API
  const fetchDeletedUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/deleted-users');
      setDeletedUsers(response.data);
    } catch (error) {
      console.error('Error fetching deleted users:', error);
    }
  }, []); // Also memoize this function

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
      console.log(response.data);
  
      // Return the newly added user instead of updating context state directly
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  


  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, [fetchUsers, fetchDeletedUsers]); // Now the effect will only run once

  return (
    <UserContext.Provider value={{
      users,
      deletedUsers,
      addUser,
      fetchUsers, // Provide the memoized function
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
