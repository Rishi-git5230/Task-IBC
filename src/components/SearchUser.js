import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchUser = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (query.length < 2) return; // Only search if query length is 2 or more
            try {
                const response = await axios.get(`http://localhost:5000/api/users?search=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [query]);

    return (
        <div>
            <h2>Search User</h2>
            <input
                type="text"
                placeholder="Search by ID or Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {results.length > 0 && (
                <ul>
                    {results.map(user => (
                        <li key={user.id}>
                            {user.first_name} {user.last_name} - {user.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUser;
