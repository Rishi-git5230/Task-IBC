import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserForm from './UserForm'; // Adjust the import path as needed

const TopMenu = ({ onLogout }) => {  // Accept onLogout prop
    const navigate = useNavigate(); // Use the useNavigate hook
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const handleAddUserClick = () => {
        setIsModalOpen(true); // Open the modal when the button is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleLogout = () => {
        // Call the onLogout function passed from the parent (App.js)
        onLogout();
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div>
            <nav className="top-menu">
                <ul className="menu-list">
                    <li><Link to="/"><button>Home</button></Link></li>
                    <li><Link to="/search"><button>Search User</button></Link></li>
                    <li>
                        <button onClick={handleAddUserClick}>Add New User</button>
                    </li>
                    <li><Link to="/deleted-users"><button>Deleted Users</button></Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>

            {isModalOpen && (
                <div className="Overlay">
                    <div className="Modal__Content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Add New User</h2>
                        <UserForm onClose={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopMenu;
