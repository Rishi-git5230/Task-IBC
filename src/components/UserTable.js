import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import UserForm from './UserForm';

Modal.setAppElement('#root');

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
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
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setMessage('');
    };

    const handleEdit = (updatedUser) => {
        const updatedUsers = users.map((user) => 
            user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id)); // Remove user from displayed list
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage('Failed to delete user');
        }
    };
    

    return (
        <div>
            <h2>User List</h2>
            {message && <div className="message">{message}</div>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Full Address</th>
                        <th>Mobile</th>
                        <th>User Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
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
                                <button onClick={() => handleOpenModal(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="User Form"
            >
                <UserForm user={currentUser} onClose={handleCloseModal} onEdit={handleEdit} />
            </Modal>
        </div>
    );
};

export default UserTable;
