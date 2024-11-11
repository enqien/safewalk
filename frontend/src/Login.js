import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};
const api = axios.create();
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Clear error

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const payload = { email: email, password: password };
    api
      .post("http://localhost:8080/login", payload, options)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        console.log("Logging in with", { email, password });
        alert("Login successful!");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Simulate successful login (replace with actual authentication logic)
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form">
        <div className="inputGroup">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Login
        </button>
      </form>
      {/* Link to Sign Up page */}
      <p className="link-text">
        Don't have an account?{" "}
        <Link to="/signup" className="link">
          Sign up here
        </Link>
        .
      </p>
    </div>
  );
}

export default Login;
