import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import UserForm from './UserForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
Modal.setAppElement('#root');

const UserTable = () => {
    const { users, fetchUsers } = useUserContext(); // Get users from context
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 50;

    useEffect(() => {
        fetchUsers(); // Fetch users when the component mounts
    }, [fetchUsers]);

    const handleOpenModal = (user = null) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setMessage('');
        fetchUsers(); // Refresh users after closing modal
    };
    const handleEdit = async (updatedUser) => {
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

    const handleDeleteSelected = async () => {
        const confirmed = window.confirm('Are you sure you want to delete the selected users?');
        if (confirmed) {
            await confirmDelete();
        }
    };

    const confirmDelete = async () => {
        try {
            await Promise.all(Array.from(selectedUsers).map(id => 
                axios.patch(`http://localhost:5000/api/users/${id}`)
            ));
            setSelectedUsers(new Set());
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error deleting users:", error);
            setMessage('Failed to delete users');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            try {
                await axios.patch(`http://localhost:5000/api/users/${id}`);
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error("Error deleting user:", error);
                setMessage('Failed to delete user');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const totalEntries = users.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentUsers = users.slice(startIndex, startIndex + entriesPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                    {currentUsers.map((user) => (
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

            {/* Pagination Controls */}
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    style={{ backgroundColor: '#007bff', color: 'white', margin: '0 5px', padding: '10px', border: 'none', borderRadius: '5px' }}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => handlePageChange(index + 1)} 
                        className={currentPage === index + 1 ? 'active' : ''}
                        style={{ backgroundColor: '#007bff', color: 'white', margin: '0 5px', padding: '10px', border: 'none', borderRadius: '5px' }}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    style={{ backgroundColor: '#007bff', color: 'white', margin: '0 5px', padding: '10px', border: 'none', borderRadius: '5px' }}
                >
                    Next
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="User Form"
            >
                <UserForm 
                    user={currentUser} 
                    onClose={handleCloseModal} 
                    onEdit={handleEdit} 
                />
            </Modal>
        </div>
    );
};

export default UserTable;
