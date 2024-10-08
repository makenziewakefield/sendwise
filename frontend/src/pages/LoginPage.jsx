import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.scss";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email, password }
      );
      const token = response.data.token;

      if (token && token.split(".").length === 3) {
        console.log("Received token:", token);
        console.log("Decoded token:", jwtDecode(token));
        localStorage.setItem("token", token);
        onLogin();
        navigate("/");
      } else {
        throw new Error("Invalid token format");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.msg || "Invalid credentials");
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
      {error && (
        <div data-cy="error-message" className="error-message">
          {error}
        </div>
      )}{" "}
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate("/signup")} className="link">
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;