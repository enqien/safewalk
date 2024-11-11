import React, { useState } from "react";
import "./SignUp.css"; // Import the CSS file
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};
const api = axios.create();
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const handleSignUp = (e) => {
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

    if (password !== repeatPassword) {
      setError("the password does not match");
      return;
    }

    const payload = { email: email, password: password };
    api
      .post("http://localhost:8080/signup", payload, options)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        console.log("signup in with", { email, password });
        alert("sign up successful!");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="form">
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

        <div className="inputGroup">
          <label>Repeat Password:</label>
          <input
            type="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="input"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
