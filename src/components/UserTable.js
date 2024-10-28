import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import UserForm from './UserForm';
import ConfirmationModal from './ConfirmationModal'; // Import the new modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
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

    const handleSelectUser = (userId) => {
        const updatedSelection = new Set(selectedUsers);
        if (updatedSelection.has(userId)) {
            updatedSelection.delete(userId);
        } else {
            updatedSelection.add(userId);
        }
        setSelectedUsers(updatedSelection);
    };

    const handleDeleteSelected = () => {
        setIsConfirmModalOpen(true); // Open confirmation modal
    };

    const confirmDelete = async () => {
        try {
            await Promise.all(Array.from(selectedUsers).map(id => 
                axios.patch(`http://localhost:5000/api/users/${id}`)
            ));
            setUsers(users.filter(user => !selectedUsers.has(user.id)));
            setSelectedUsers(new Set()); // Reset selection
        } catch (error) {
            console.error("Error deleting users:", error);
            setMessage('Failed to delete users');
        } finally {
            setIsConfirmModalOpen(false); // Close confirmation modal
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage('Failed to delete user');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    return (
        <div>
            <h2 className="centered">User List</h2>

            {message && <div className="message">{message}</div>}
            <button className="button" onClick={handleDeleteSelected} disabled={selectedUsers.size === 0}>
                Delete Selected
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
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
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.has(user.id)} 
                                    onChange={() => handleSelectUser(user.id)} 
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{formatDate(user.dob)}</td>
                            <td>{user.gender}</td>
                            <td>{user.email}</td>
                            <td>{user.full_address}</td>
                            <td>{user.mobile}</td>
                            <td>{user.user_status}</td>
                            <td>
                                <FontAwesomeIcon 
                                    icon={faEdit} 
                                    onClick={() => handleOpenModal(user)} 
                                    style={{ cursor: 'pointer', marginRight: '10px' }} 
                                />
                                <FontAwesomeIcon 
                                    icon={faTrash} 
                                    onClick={() => handleDelete(user.id)} 
                                    style={{ cursor: 'pointer', color: 'red' }} 
                                />
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

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default UserTable;
