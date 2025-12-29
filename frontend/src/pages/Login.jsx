import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="Company Logo" className="large-logo" />
        </div>

        <h1 className="form-title">Sign in</h1>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Email address" />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="helper-link">Password assistance</a>
            </div>
            <input type="password" placeholder="Password" />
          </div>

          <button type="submit" className="btn-submit">
            Sign in
          </button>
        </form>

        <div className="auth-footer-info">
          <p className="policy-text">
            By signing in, you agree to the Company's Name{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
          
          <div className="keep-signed-in">
            <input type="checkbox" id="keep-signed" />
            <label htmlFor="keep-signed">Keep me signed in. <a href="#">Details</a></label>
          </div>

          <div className="separator">
            <span>New to our service?</span>
          </div>

          <button 
            type="button" 
            className="btn-signup-redirect"
            onClick={() => navigate("/Register")}
          >
            Sign up
          </button>
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