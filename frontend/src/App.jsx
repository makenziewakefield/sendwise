import React from "react";
import "./styles/App.scss";
import History from "./pages/HistoryPage";
import ContactsPage from "./pages/ContactsPage";

function App() {
  return (
    <div>
      <h1>Welcome to SendWise</h1>
      <History />
      <ContactsPage />
    </div>
  );
}

export default App;
