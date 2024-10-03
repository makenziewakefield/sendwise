import React, { useState, useEffect } from "react";
import History from "./pages/HistoryPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import SendMoney from "./pages/SendMoney";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import "./styles/App.scss";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigateTo("home");
  };

  return (
    <div className="App">
      <NavBar
        navigateTo={navigateTo}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      <div>
        {currentPage === "home" && <HomePage />}
        {currentPage === "send-money" &&
          (isLoggedIn ? (
            <SendMoney />
          ) : (
            <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />
          ))}
        {currentPage === "history" &&
          (isLoggedIn ? (
            <History />
          ) : (
            <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />
          ))}
        {currentPage === "contacts" &&
          (isLoggedIn ? (
            <ContactsPage />
          ) : (
            <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />
          ))}
        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />
        )}
        {currentPage === "signup" && (
          <SignupPage onSignup={handleLogin} navigateTo={navigateTo} />
        )}
      </div>
    </div>
  );
}

export default App;
