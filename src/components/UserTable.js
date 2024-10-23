import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import UserForm from './UserForm'; // Make sure to import UserForm

Modal.setAppElement('#root');

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // To hold the user being edited
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
        setCurrentUser(user); // Set current user if editing
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null); // Reset the current user
        setMessage('');
    };

    const handleEdit = (user) => {
        handleOpenModal(user);
    };

    const handleDelete = async (id) => {
        // Your delete logic here
    };

    return (
        <div>
            <h2>User List</h2>
            <button onClick={() => handleOpenModal()}>Add New User</button>
            {message && <div className="message">{message}</div>}
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
                                <button onClick={() => handleEdit(user)}>Edit</button>
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
                contentLabel="User Form"
            >
                <UserForm user={currentUser} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default UserTable;
