import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="landing-footer">
        <div className="footer-container">
          
          <div className="footer-column">
            <h3>COMPANY</h3>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Interest Based Ads</a></li>
              <li><a href="#">Ad Preferences</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>WORK WITH US</h3>
            <ul>
              <li><a href="#">Authors</a></li>
              <li><a href="#">Advertise</a></li>
              <li><a href="#">Authors & ads blog</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>CONNECT</h3>
            <div className="social-media-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-column app-section">
            <div className="app-badges-container">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="store-badge" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="store-badge" />
            </div>
            <p className="footer-copyright">© 2025 Company’s Name, Inc.</p>
          </div>
        </div>
      </footer>
  );
}