import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="register-page">
      <div className="register-box">
        <div className="register-logo" onClick={() => navigate("/LandingPage")}>Logo</div>

        <h1>Create Account</h1>

        <form className="register-form">
          <label>Your name</label>
          <input type="text" placeholder="First name and last name" />

          <label>Email</label>
          <input type="email" />

          <label>Password</label>
          <input type="password" placeholder="At least 6 characters" />
          <p className="hint">ⓘ Passwords must be at least 6 characters.</p>

          <label>Re-enter password</label>
          <input type="password" />

          <button type="submit">Create an account</button>
        </form>

        <p className="terms">
          By creating an account, you agree to the Company’s Name{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>

        <p className="signin">
          Already have an account? <a href="" onClick={() => navigate("/Login")}>Sign in</a>
        </p>

        <footer className="register-footer">
          <a href="#">Term of Service</a>
          <a href="#">Privacy</a>
          <a href="#">Help</a>
          <p>© 2025 Company’s Name, Inc.</p>
        </footer>
      </div>
    </div>
  );
}
