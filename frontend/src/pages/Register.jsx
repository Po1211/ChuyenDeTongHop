import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  
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

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, rePassword } = formData;

    if (!name || !email || !password || !rePassword) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
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

    console.log("Registration Successful:", formData);
    navigate("/GenreSelection");
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
              placeholder="First name and last name" 
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
              placeholder="At least 6 characters" 
              value={formData.password}
              onChange={handleChange}
            />
            <p className="password-hint">ⓘ Passwords must be at least 6 characters.</p>
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

        <div className="auth-footer-info">
          <p className="policy-text">
            By creating an account, you agree to the Company's Name{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
          <p className="login-redirect">
            Already have an account? <span onClick={() => navigate("/Login")}>Sign in</span>
          </p>
        </div>

        <footer className="footer-links-area">
          <div className="links-row">
            <a href="#">Term of Service</a>
            <a href="#">Privacy</a>
            <a href="#">Help</a>
          </div>
          <p className="copyright">© 2025 Company's Name, Inc.</p>
        </footer>
      </div>
    </div>
  );
}