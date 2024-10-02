import React from "react";
import '../styles/NavBar.scss';

const NavBar = ({ navigateTo }) => {
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
