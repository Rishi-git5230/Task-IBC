import React from 'react';
import { useUserContext } from '../context/UserContext';

const UserTable = () => {
  const { users, deleteUser } = useUserContext();

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Email</th>
          <th>Full Address</th>
          <th>Mobile</th>
          <th>User Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.dob}</td>
            <td>{user.gender}</td>
            <td>{user.email}</td>
            <td>{user.full_address}</td>
            <td>{user.mobile}</td>
            <td>{user.user_status}</td>
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
