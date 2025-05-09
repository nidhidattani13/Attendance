import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, UserPlus, FileText, Users, BarChart } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  // Check if the path matches the current route
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Camera size={26} color="#4361ee" />
        <h1>Face Attendance</h1>
      </div>
      
      <div className="sidebar-content">
        <div className="menu-section">
          <h3>MAIN MENU</h3>
          <ul className="sidebar-nav">
            <li className={isActive('/')}>
              <Link to="/">
                <Camera size={20} />
                <span>Take Attendance</span>
              </Link>
            </li>
            <li className={isActive('/register')}>
              <Link to="/register">
                <UserPlus size={20} />
                <span>Register Student</span>
              </Link>
            </li>
            <li className={isActive('/report')}>
              <Link to="/report">
                <FileText size={20} />
                <span>Attendance Report</span>
              </Link>
            </li>
            <li className={isActive('/students')}>
              <Link to="/students">
                <Users size={20} />
                <span>Student List</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="menu-section">
          <h3>ANALYTICS</h3>
          <ul className="sidebar-nav">
            <li>
              <Link to="/stats">
                <BarChart size={20} />
                <span>Statistics</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <p>© {new Date().getFullYear()} Face Attendance</p>
      </div>
    </div>
  );
};

export default Sidebar;