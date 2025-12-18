import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">Logo</div>

        <h1>Sign in</h1>

        <form className="login-form">
          {/* Trường Email */}
          <label>Email</label>
          <input type="email" placeholder="First name and last name" />

          {/* Trường Password */}
          <label className="password-label">
            Password
            <a href="#" className="password-assistance">                   Password assistance</a>
          </label>
          <input type="password" placeholder="First name and last name" />

          {/* Nút Đăng nhập chính */}
          <button type="submit" className="signin-button">Sign in</button>

          {/* Điều khoản */}
          <p className="terms">
            By signing in, you agree to the Company's Name{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
          
          {/* Checkbox Keep me signed in */}
          <label className="keep-signed-in">
            <input type="checkbox" />
            Keep me signed in. <a href="#">Details.</a>
          </label>

          {/* Phần chia và Nút Đăng ký */}
          <div className="separator-text">
            <hr />
            <span>New to our service?</span>
            <hr />
          </div>
          <button 
            type="button" 
            className="signup-button" 
            onClick={() => navigate("/Register")}
          >
            Sign up
          </button>
        </form>
        
        {/* Footer */}
        <footer className="login-footer">
          <a href="#">Term of Service</a>
          <a href="#">Privacy</a>
          <a href="#">Help</a>
          <p>© 2025 Company’s Name, Inc.</p>
        </footer>
      </div>
    </div>
  );
}