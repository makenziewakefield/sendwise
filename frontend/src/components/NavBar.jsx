import React from "react";
import '../styles/NavBar.scss'

const NavBar = ({ navigateTo }) => {
  return (
    <nav>
      <div className="nav-buttons">
        <button className="nav-home-button" onClick={() => navigateTo('home')}>SendWise</button>
        <div>
          <button onClick={() => navigateTo('history')}>History</button>
          <button onClick={() => navigateTo('contacts')}>Contacts</button>
          <button onClick={() => navigateTo('analytics')}>Analytics</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
