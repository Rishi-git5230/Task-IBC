import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserTable />} />
          <Route path="/add-user" element={<UserForm />} />
          {/* Add routes for other components like DeletedUsers, SearchUser, etc. */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
