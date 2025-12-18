import { useNavigate } from "react-router-dom";
import "../styles/Landingpage.css";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="page-root">
      {/* Header */}
      <header class="main-header">
  <div class="header-container">
    <div class="logo">
      <img src="/logo.svg" alt="Logo" />
    </div>
  </div>
</header>


      {/* Hero banner full width */}
      <div className="hero-banner" role="img" aria-label="books banner"></div>

      {/* Main content */}
      <main className="container main-content">
        <div className="grid cols-2">
          {/* Left column */}
          <section className="left-col">
            <div className="intro-row">
              <div className="intro-block">
                <h2>Deciding what to read next?</h2>
                <p className="lead">
                  You're in the right place. Tell us what titles or genres you've enjoyed in the past,
                  and we'll give you surprisingly insightful recommendations.
                </p>
              </div>

              <div className="intro-block">
                <h2>What are your friends reading?</h2>
                <p className="lead">
                  Chances are your friends are discussing their favorite (and least favorite) books on
                  Goodreads.
                </p>
              </div>
            </div>

            {/* Recommendation cards */}
            <section className="recommendations card">
              <div className="rec-row">
                <h3 className="rec-title">Because Brian liked...</h3>
                <div className="book-strip">
                  <img src="/covers/cover1.jpg" alt="book1" />
                  <img src="/covers/cover1.jpg" alt="book2" />
                  <img src="/covers/cover1.jpg" alt="book3" />
                  <img src="/covers/cover1.jpg" alt="book4" />
                </div>

                <div className="discovery-row">
                  <div className="disc-left">
                    <div className="arrow">→</div>
                  </div>
                  <div className="disc-right">
                    <div className="disc-card">
                      <div className="disc-thumb">
                        <img src="/covers/cover1.jpg" alt="discovered" />
                      </div>
                      <div className="disc-meta">
                        <div className="disc-title">He discovered:</div>
                        <div className="disc-tags">Nonfiction, History</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="rec-row">
                <h3 className="rec-title">Because Brian liked...</h3>
                <div className="book-strip">
                  <img src="/covers/cover1.jpg" alt="bookA" />
                  <img src="/covers/cover1.jpg" alt="bookB" />
                  <img src="/covers/cover1.jpg" alt="bookC" />
                </div>

                <div className="discovery-row">
                  <div className="disc-left">
                    <div className="arrow">→</div>
                  </div>
                  <div className="disc-right">
                    <div className="disc-card">
                      <div className="disc-thumb">
                        <img src="/covers/cover1.jpg" alt="discovered2" />
                      </div>
                      <div className="disc-meta">
                        <div className="disc-title">He discovered:</div>
                        <div className="disc-tags">YA, Dystopia, Romance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>

          {/* Right column */}
          <aside className="right-col">
            <div className="signup card">
              <h3>Discover & read more</h3>
              <button className="btn btn-apple">Continue with Apple</button>
              <button className="btn btn-amazon">Continue with Amazon</button>
              <button className="btn btn-email" onClick={() => navigate("/Register")}>Sign up with Email</button>
              <p className="small muted">
                By creating an account, you agree to the Terms of Service and Privacy Policy.
              </p>
              <p className="muted small" >Already a member? <a href="" onClick={() => navigate("/Login")}>Sign In</a></p>
            </div>

            <div className="search card">
              <h4>Search and browse books</h4>
              <input type="text" placeholder="Title / Author / ISBN" />
              <div className="catalog">
                <div className="catalog-col">
                  <a>Art</a>
                  <a>Biography</a>
                  <a>Business</a>
                  <a>Children's</a>
                  <a>Classics</a>
                </div>
                <div className="catalog-col">
                  <a>Nonfiction</a>
                  <a>History</a>
                  <a>Memoir</a>
                  <a>YA</a>
                  <a>Romance</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-top container">
          <div className="footer-left">
            <h4>COMPANY</h4>
            <a>About us</a>
            <a>Careers</a>
            <a>Terms</a>
            <a>Privacy</a>
          </div>

          <div className="footer-mid">
            <h4>WORK WITH US</h4>
            <a>Authors</a>
            <a>Advertise</a>
          </div>

          <div className="footer-right">
            <h4>CONNECT</h4>
            <div className="socials">
              <span>f</span><span>t</span><span>in</span>
            </div>
            <div className="app-buttons">
              <a className="app-btn">Get it on Google Play</a>
              <a className="app-btn">App Store</a>
            </div>
            <small>© 2025 Company's Name, Inc.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}
