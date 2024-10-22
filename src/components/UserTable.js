import React from 'react';
import { useUserContext } from '../context/UserContext';

const UserTable = () => {
  const { users, deleteUser } = useUserContext();

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
              {/* Add edit functionality here */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
