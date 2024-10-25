import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeletedUsers = () => {
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetchDeletedUsers();
    }, []);

    const fetchDeletedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/deleted-users');
            setDeletedUsers(response.data);
        } catch (error) {
            console.error("Error fetching deleted users:", error);
        }
    };

    const handleEnableUser = async (id) => {
        await axios.patch(`http://localhost:5000/api/users/enable/${id}`);
        fetchDeletedUsers(); // Refresh the deleted users list
    };

    const handleBulkEnable = async () => {
        await Promise.all(selectedUsers.map(id => axios.patch(`http://localhost:5000/api/users/enable/${id}`)));
        fetchDeletedUsers(); // Refresh the deleted users list
        setSelectedUsers([]); // Clear selection
    };

    const handleSelectUser = (id) => {
        setSelectedUsers((prev) => {
            if (prev.includes(id)) {
                return prev.filter(userId => userId !== id);
            }
            return [...prev, id];
        });
    };

    return (
        <div>
            <h2 className="centered">Deleted Users</h2>
            <button  class="button" onClick={handleBulkEnable} disabled={selectedUsers.length === 0}>
                Enable Selected Users
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deletedUsers.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleEnableUser(user.id)}>Enable</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeletedUsers;
