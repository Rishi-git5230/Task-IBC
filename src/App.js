import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import Login from './components/Login';
import TopMenu from './components/TopMenu';
import DeletedUsers from './components/DeletedUsers';
import SearchUser from './components/SearchUser';
import './App.css';
import Modal from 'react-modal';

// Configure Modal
Modal.setAppElement('#root');

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // This will hide the TopMenu
  };

  return (
    <UserProvider>
      <Router>
        {/* Only show the TopMenu if logged in */}
        {isLoggedIn && <TopMenu onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={isLoggedIn ? <UserTable /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add-user"
            element={isLoggedIn ? <UserForm /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/deleted-users"
            element={isLoggedIn ? <DeletedUsers /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/search"
            element={isLoggedIn ? <SearchUser /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
