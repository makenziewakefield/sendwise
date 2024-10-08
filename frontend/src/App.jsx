import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import SendMoney from "./pages/SendMoney";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import "./styles/App.scss";
import axios from "axios";
import AnalyticsPage from "./pages/AnalyticsPage";

axios.defaults.withCredentials = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userId = localStorage.getItem("currentUserId");
      setCurrentUserId(userId);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUserId(null);
  };

  return (
    <Router>
      <div className="App">
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" 
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} 
          />
          <Route
            path="/send-money"
            element={isLoggedIn ? <SendMoney /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={isLoggedIn ? <HistoryPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/contacts"
            element={
              isLoggedIn ? <ContactsPage currentUserId={currentUserId} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/analytics"
            element={isLoggedIn ? <AnalyticsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <SignupPage onSignup={handleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;