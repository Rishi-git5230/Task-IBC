import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const SearchUser = () => {
    const [query, setQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all users once on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setAllUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Update filtered results based on the query
    useEffect(() => {
        if (query.length < 2) {
            setFilteredResults([]);
            return;
        }

        const results = allUsers.filter(user => 
            user.first_name.toLowerCase().includes(query.toLowerCase()) ||
            user.last_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(results);
    }, [query, allUsers]);

    const handleEdit = (user) => {
        // Implement your edit functionality here
        console.log("Edit user:", user);
    };

    const handleDelete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${id}`); // Assuming this endpoint deletes the user
            setFilteredResults(filteredResults.filter(user => user.id !== id)); // Update the state after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
            setError('Failed to delete user');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Search User</h2>
            <input
                type="text"
                placeholder="Search by First Name or Last Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
            />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {filteredResults.length > 0 && (
                <table style={{ margin: '0 auto', border: '1px solid #ddd', width: '80%' }}>
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
                        {filteredResults.map(user => (
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
                                    <FontAwesomeIcon 
                                        icon={faEdit} 
                                        onClick={() => handleEdit(user)} 
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
            )}
            {filteredResults.length === 0 && query.length >= 2 && !loading && !error && (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchUser;
