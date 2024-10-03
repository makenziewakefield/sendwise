import React from "react";
import PropTypes from "prop-types";
import "../styles/NavBar.scss";

const NavBar = ({ navigateTo, isLoggedIn, handleLogout }) => {
  return (
    <nav>
      <div className="nav-buttons">
        <button className="nav-home-button" onClick={() => navigateTo("home")}>
          SendWise
        </button>
        <div>
          <button onClick={() => navigateTo("send-money")}>Send Money</button>
          <button onClick={() => navigateTo("history")}>History</button>
          <button onClick={() => navigateTo("contacts")}>Contacts</button>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => navigateTo("login")}>Login/Signup</button>
          )}
        </div>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;
