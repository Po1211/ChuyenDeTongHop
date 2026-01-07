import React from "react";
import Header from "../components/Header";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-screen">
      <Header />

      <div className="home-content">
        <aside className="left-aside">
          <section className="home-card-section">
            <h2 className="home-card-title">CURRENTLY READING</h2>
            <div className="current-reading-item">
              <img src="/covers/cover5.jpg" alt="Book" className="book-cover-shadow" />
              <div className="book-info-right">
                <p className="book-name-link">The Great Gatsby</p>
                <p className="author-name-sub">by F. Scott Fitzgerald</p>
                <button className="btn-update-small">Update progress</button>
              </div>
            </div>
            <div className="card-footer-action">
              <a href="#">View all books</a> <span className="sep">•</span> <a href="#">Add a book</a>
            </div>
          </section>

          <section className="home-card-section">
            <h2 className="home-card-title">BOOKSHELVES</h2>
            <nav className="shelf-navigation">
              <div className="shelf-row">
                <span className="count-num">45</span> <a href="#" className="shelf-link">Read</a>
              </div>
              <div className="shelf-row">
                <span className="count-num">3</span> <a href="#" className="shelf-link">Currently Reading</a>
              </div>
              <div className="shelf-row">
                <span className="count-num">12</span> <a href="#" className="shelf-link">Want to Read</a>
              </div>
            </nav>
          </section>
        </aside>

        <main className="main-feed">
          <h2 className="feed-title-header">UPDATES</h2>
          <div className="activity-card">
            <div className="activity-header">
              <img src="/avatars/avatar1.jpg" alt="User" className="user-avatar-small" />
              <p className="activity-text">
                <span className="user-name">A </span> 
                has read
                <span className="book-name-link"> Book1</span>
              </p>
            </div>
            <div className="activity-container-flex">
              <div className="activity-book-cover-col">
                <img src="/covers/cover1.jpg" alt="Book Cover" className="feed-book-cover" />
              </div>
              <div className="activity-info-col">
                <div className="book-rating-row">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">4.90 avg rating</span>
                </div>
                
                <p className="user-review-quote">
                  "This book is changing how I see the world. It’s a fascinating look at our species' history and the myths we've created."
                </p>

                <div className="activity-footer-actions">
                  <button className="btn-action">Like</button>
                  <span className="dot">•</span>
                  <button className="btn-action">Comment</button>
                  <span className="activity-time">1 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-header">
              <img src="/avatars/avatar2.jpg" alt="User" className="user-avatar-small" />
              <p className="activity-text">
                <span className="user-name">B </span> 
                want to read 
                <span className="book-name-link"> Book2</span>
              </p>
            </div>
            <div className="activity-container-flex">
              <div className="activity-book-cover-col">
                <img src="/covers/cover2.jpg" alt="Book Cover" className="feed-book-cover" />
              </div>
              <div className="activity-info-col">
                <div className="book-rating-row">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">4.80 avg rating</span>
                </div>
                
                <p className="user-review-quote">
                  "You will never understand how the land remembers, how deep the roots grow'"
                </p>

                <div className="activity-footer-actions">
                  <button className="btn-action">Like</button>
                  <span className="dot">•</span>
                  <button className="btn-action">Comment</button>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-header">
              <img src="/avatars/avatar3.jpg" alt="User" className="user-avatar-small" />
              <p className="activity-text">
                <span className="user-name">C </span> 
                has read 
                <span className="book-name-link"> Book3</span>
              </p>
            </div>
            <div className="activity-container-flex">
              <div className="activity-book-cover-col">
                <img src="/covers/cover3.jpg" alt="Book Cover" className="feed-book-cover" />
              </div>
              <div className="activity-info-col">
                <div className="book-rating-row">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">4.70 avg rating</span>
                </div>
                
                <p className="user-review-quote">
                  "Winning means fame and fortune. Losing means certain death. The Hunger Games have begun. . . ."
                </p>

                <div className="activity-footer-actions">
                  <button className="btn-action">Like</button>
                  <span className="dot">•</span>
                  <button className="btn-action">Comment</button>
                  <span className="activity-time">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-header">
              <img src="/avatars/avatar4.jpg" alt="User" className="user-avatar-small" />
              <p className="activity-text">
                <span className="user-name">D </span> 
                want to read 
                <span className="book-name-link"> Book4</span>
              </p>
            </div>
            <div className="activity-container-flex">
              <div className="activity-book-cover-col">
                <img src="/covers/cover4.jpg" alt="Book Cover" className="feed-book-cover" />
              </div>
              <div className="activity-info-col">
                <div className="book-rating-row">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-text">4.60 avg rating</span>
                </div>
                
                <p className="user-review-quote">
                  "This stunning slow-burn romantasy follows a fated pair who uncover a world-changing secret and are thrust into a violent class war, navigating love, loss, and devastating betrayals."
                </p>

                <div className="activity-footer-actions">
                  <button className="btn-action">Like</button>
                  <span className="dot">•</span>
                  <button className="btn-action">Comment</button>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="column-right">
          <div className="card-box">
            <h3 className="card-title">RECOMMENDATIONS</h3>
            <div className="rec-item">
              <img src="/covers/cover5.jpg" alt="Rec" className="rec-img" />
              <div className="rec-info">
                <p className="rec-book-name">Atomic Habits</p>
                <p className="rec-author">James Clear</p>
                <button className="btn-wtr-small">Want to Read</button>
              </div>
            </div>
            <div className="rec-item">
              <img src="/covers/cover5.jpg" alt="Rec" className="rec-img" />
              <div className="rec-info">
                <p className="rec-book-name">Deep Work</p>
                <p className="rec-author">Cal Newport</p>
                <button className="btn-wtr-small">Want to Read</button>
              </div>
            </div>
            <a href="#" className="footer-link-bold">View all recommendations</a>
          </div>
        </aside>
      </div>
    </div>
  );
}