import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const isAuthenticated = auth.currentUser;
  const isWelcomePage = location.pathname === '/welcome';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isAuthenticated ? (
          <>
            <Link to="/survey-builder" className={`nav-link ${isActive('/survey-builder') ? 'active' : ''}`}>
              Survey Builder
            </Link>
            <Link to="/my-surveys" className={`nav-link ${isActive('/my-surveys') ? 'active' : ''}`}>
              My Surveys
            </Link>
          </>
        ) : !isWelcomePage && (
          <Link to="/welcome" className="nav-link">
            Sign In
          </Link>
        )}
      </div>
      <div className="navbar-auth">
        {isAuthenticated && (
          <div className="user-section">
            <span className="user-email">{auth.currentUser.isAnonymous ? 'Guest' : (auth.currentUser.email || 'Anonymous User')}</span>
            <button 
              className="sign-out-button" 
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 