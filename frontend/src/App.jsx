import React, { useState } from "react";
import History from "./pages/HistoryPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <NavBar navigateTo={navigateTo} />
      <div>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'history' && <History />}
      </div>
    </div>
  );
}

export default App;
