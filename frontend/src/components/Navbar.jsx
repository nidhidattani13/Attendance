import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Take Attendance</Link></li>
        <li><Link to="/register">Register Student</Link></li>
        <li><Link to="/report">Attendance Report</Link></li>
        <li><Link to="/students">Student List</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;