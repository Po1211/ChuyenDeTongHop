import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-site-wrapper">
      <nav className="site-navbar">
        <div className="container-inner">
          <img 
            src="/logo.jpg"
            alt="Logo" 
            className="navbar-logo" 
            onClick={() => navigate("/")} 
          />
        </div>
      </nav>

      <header className="hero-banner-section">
        <div className="hero-shading-overlay">
          <div className="container-inner hero-flex-layout">
            <div className="hero-text-group">
              <div className="text-column">
                <h2>Deciding what to read next?</h2>
                <p>You're in the right place. Tell us what titles or genres you've enjoyed in the past, and we'll give you surprisingly insightful recommendations.</p>
              </div>
              <div className="text-column">
                <h2>What are your friends reading?</h2>
                <p>Chances are your friends are discussing their favorite books on Goodreads.</p>
              </div>
            </div>

            <div className="auth-card-widget">
              <h3>Discover & read more</h3>
              <button className="auth-btn apple">Continue with Apple</button>

              <button 
                className="auth-btn amazon" 
                onClick={() => navigate("/GenreSelection")}
              >
                Continue with Amazon
              </button>

              <button 
                className="auth-btn email" 
                onClick={() => navigate("/Register")}
              >
                Sign up with Email
              </button>
              
              <p className="legal-notice">
                By creating an account, you agree to the Goodreads <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
              
              <div className="auth-card-footer">
                Already a member? <span className="sign-in-link" onClick={() => navigate("/Login")}>Sign In</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="discovery-section">
        <div className="discovery-container">
          <div className="discovery-left">
            <p className="label-text">Because Brian liked...</p>
            <div className="book-row-container">
              <img src="/covers/cover1.jpg" alt="Book 1" className="book-cover-img" />
              <img src="/covers/cover2.jpg" alt="Book 2" className="book-cover-img" />
              <img src="/covers/cover3.jpg" alt="Book 3" className="book-cover-img" />
              <img src="/covers/cover4.jpg" alt="Book 4" className="book-cover-img" />
              <span className="arrow-icon">➔</span>
              <div className="discovery-result-group">
                <div className="result-image-wrapper">
                  <img src="/covers/cover5.jpg" alt="Discovery" className="book-cover-img result-border" />
                </div>
                <div className="genre-hint-box">
                  <p className="genre-text">Nonfiction, History</p>
                </div>
              </div>
            </div>

            <div className="second-row-divider"></div>
            <p className="label-text">Recommended for you...</p>
            <div className="book-row-container">
              <img src="/covers/cover1.jpg" alt="Book 5" className="book-cover-img" />
              <img src="/covers/cover2.jpg" alt="Book 6" className="book-cover-img" />
              <img src="/covers/cover3.jpg" alt="Book 7" className="book-cover-img" />
              <img src="/covers/cover4.jpg" alt="Book 8" className="book-cover-img" />
              <span className="arrow-icon">➔</span>
              <div className="discovery-result-group">
                <div className="result-image-wrapper">
                  <img src="/covers/cover5.jpg" alt="Discovery" className="book-cover-img result-border" />
                </div>
                <div className="genre-hint-box">
                  <p className="genre-text">Fantasy, Fiction</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="discovery-right">
            <h3>Search and browse books</h3>
            <div className="search-container">
              <input type="text" placeholder="Title / Author / ISBN" className="search-input-field" />
            </div>

            <div className="genres-grid">

            <div className="genre-column">
              <span>Art</span>
              <span>Biography</span>
              <span>Business</span>
              <span>Children's</span>
              <span>Christian</span>
              <span>Classics</span>
              <span>Comics</span>
              <span>Cookbooks</span>
            </div>

            <div className="genre-column">
              <span>Ebooks</span>
              <span>Fantasy</span>
              <span>Fiction</span>
              <span>Graphic Novels</span>
              <span>Historical Fiction</span>
              <span>History</span>
              <span>Horror</span>
              <span>Memoir</span>
            </div>
            
            <div className="genre-column">
              <span>Music</span>
              <span>Mystery</span>
              <span>Nonfiction</span>
              <span>Poetry</span>
              <span>Psychology</span>
              <span>Romance</span>
              <span>Science</span>
              <span>Science Fiction</span>
            </div>
            
            <div className="genre-column">
              <span>Self Help</span>
              <span>Sports</span>
              <span>Thriller</span>
              <span>Travel</span>
              <span>Young Adult</span>
              <a href="#" className="more-genres-link">More genres</a>
            </div>
          </div>
        </div>
        </div>
      </main>
      
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
    </div>
  );
}