import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

// Configure Modal
Modal.setAppElement('#root');

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '' });
    const [editingUserId, setEditingUserId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setNewUser({ first_name: user.first_name, last_name: user.last_name, email: user.email });
            setEditingUserId(user.id);
        } else {
            setNewUser({ first_name: '', last_name: '', email: '' });
            setEditingUserId(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users', newUser);
            setMessage(`User added successfully with ID: ${response.data.id}`);
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, newUser);
            setMessage(`User updated successfully with ID: ${response.data.id}`);
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            setMessage(`User deleted successfully.`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <button onClick={() => handleOpenModal()}>Add New User</button>
            {message && <div>{message}</div>}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleOpenModal(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Adding/Editing User */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Add/Edit User"
            >
                <h2>{editingUserId ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={editingUserId ? handleEditUser : handleAddUser}>
                    <input
                        type="text"
                        name="first_name"
                        value={newUser.first_name}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={newUser.last_name}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                    <button type="submit">{editingUserId ? 'Update User' : 'Add User'}</button>
                    <button type="button" onClick={handleCloseModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default UserTable;
