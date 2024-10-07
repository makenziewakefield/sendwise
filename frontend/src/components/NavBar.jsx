import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/NavBar.scss";

const NavBar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav>
      <div className="nav-buttons">
        <Link to="/" className="nav-home-button">
          SendWise
        </Link>
        <div>
          <Link to="/send-money">Send Money</Link>
          <Link to="/history">History</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/analytics">Analytics</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login/Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;
