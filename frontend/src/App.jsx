import React, { useState } from "react";
import History from "./pages/HistoryPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import SendMoney from "./pages/SendMoney"; // Import SendMoney page
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
        {currentPage === 'send-money' && <SendMoney />} {/* Add SendMoney page */}
      </div>
    </div>
  );
}

export default App;
