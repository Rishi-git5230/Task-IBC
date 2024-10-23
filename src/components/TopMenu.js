import React from 'react';
import { Link } from 'react-router-dom';

const TopMenu = () => {
    return (
        <nav className="top-menu">
            <ul className="menu-list">
                <li><Link to="/"><button>Home</button></Link></li>
                <li><Link to="/search"><button>Search User</button></Link></li>
                <li><Link to="/add-user"><button>Add New User</button></Link></li>
                <li><Link to="/deleted-users"><button>Deleted Users</button></Link></li>
            </ul>
        </nav>
    );
};

export default TopMenu;
