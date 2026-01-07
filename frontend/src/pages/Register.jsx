import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, rePassword } = formData;

    if (!name || !email || !password || !rePassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      navigate("/home");
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="register-screen">
      <div className="register-container">
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="Logo" className="large-logo" />
        </div>

        <h1 className="form-title">Create Account</h1>

        <form className="register-form" onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Your name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Re-enter password</label>
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-submit">
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
}
