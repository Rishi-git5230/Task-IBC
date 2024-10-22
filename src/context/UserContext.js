import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const fetchDeletedUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/deleted-users');
    setDeletedUsers(response.data);
  };

  const addUser = async (name, email) => {
    const response = await axios.post('http://localhost:5000/api/users', { name, email });
    setUsers([...users, response.data]);
    return response.data;
  };

  const updateUser = async (id, name, email) => {
    const response = await axios.put(`http://localhost:5000/api/users/${id}`, { name, email });
    setUsers(users.map(user => (user.id === id ? response.data : user)));
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setUsers(users.filter(user => user.id !== id));
  };

  const enableUser = async (id) => {
    await axios.patch(`http://localhost:5000/api/users/enable/${id}`);
    fetchDeletedUsers(); // Refresh deleted users
  };

  const bulkDeleteUsers = async (ids) => {
    await axios.delete('http://localhost:5000/api/users/bulk-delete', { data: { ids } });
    fetchUsers(); // Refresh users
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

export const useUserContext = () => useContext(UserContext);
