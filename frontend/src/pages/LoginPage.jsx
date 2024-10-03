import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.scss";

const LoginPage = ({ onLogin, navigateTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      { email, password }
    );
    const token = response.data.token;
    console.log('Received token:', token);
    console.log('Decoded token:', jwtDecode(token));
    localStorage.setItem("token", token);
    onLogin();
    navigateTo("home");
  } catch (error) {
    console.error("Login error:", error);
    alert(error.response?.data?.msg || "Login failed. Please try again.");
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigateTo("signup")} className="link">
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
