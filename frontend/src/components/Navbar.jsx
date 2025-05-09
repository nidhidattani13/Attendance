import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, UserPlus, FileText, Users } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  // Check if the path matches the current route
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Camera size={24} />
          <span>Face Attendance</span>
        </div>
        
        <ul className="nav-links">
          <li className={isActive('/')}>
            <Link to="/">
              <Camera size={18} />
              <span>Take Attendance</span>
            </Link>
          </li>
          <li className={isActive('/register')}>
            <Link to="/register">
              <UserPlus size={18} />
              <span>Register Student</span>
            </Link>
          </li>
          <li className={isActive('/report')}>
            <Link to="/report">
              <FileText size={18} />
              <span>Attendance Report</span>
            </Link>
          </li>
          <li className={isActive('/students')}>
            <Link to="/students">
              <Users size={18} />
              <span>Student List</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;