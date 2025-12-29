import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  const communityRef = useRef(null);
  const browseRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setIsBrowseOpen(false);
      }
      if (communityRef.current && !communityRef.current.contains(event.target)) {
        setIsCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleBrowse = () => {
    setIsBrowseOpen(!isBrowseOpen);
    setIsCommunityOpen(false);
  };

  const toggleCommunity = () => {
    setIsCommunityOpen(!isCommunityOpen);
    setIsBrowseOpen(false);
  };

  return (
    <nav className="main-header">
      <div className="header-inner">
        <div className="header-left">
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="nav-logo" 
            onClick={() => navigate("/home")} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/45x45?text=Logo" }}
          />
          
          <div className="nav-menu">
            <span className="nav-link" onClick={() => navigate("/home")}>Home</span>
            <span className="nav-link">My Books</span>
            
            <div className="nav-item-dropdown" ref={browseRef}>
              <span 
                className={`nav-link ${isBrowseOpen ? "active-dropdown" : ""}`}
                onClick={() => { setIsBrowseOpen(!isBrowseOpen); setIsCommunityOpen(false); }}
              >
                Browse ▾
              </span>
              {isBrowseOpen && (
                <div className="browse-dropdown-box">
                  <div className="browse-column right-col">
                    <ul>
                      <li>Recommendations</li>
                      <li>Choice Awards</li>
                      <li>Giveaways</li>
                      <li>New Releases</li>
                      <li>Lists</li>
                      <li>Explore</li>
                      <li>News & Interviews</li>
                    </ul>
                  </div>

                  <div className="browse-column right-col">
                    <p className="column-title">GENRES</p>
                    <ul>
                      <li>Art</li>
                      <li>Comics</li>
                      <li>History</li>
                      <li onClick={() => navigate("/genreFantasy")}>Fantasy</li>
                      <li className="view-all">More genres...</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="nav-item-dropdown" ref={communityRef}>
              <span 
                className={`nav-link ${isCommunityOpen ? "active-dropdown" : ""}`}
                onClick={() => setIsCommunityOpen(!isCommunityOpen)}
              >
                Community ▾
              </span>
              
              {isCommunityOpen && (
                <ul className="dropdown-menu">
                  <li>Groups</li>
                  <li>Discussions</li>
                  <li>Quotes</li>
                  <li>Ask the Author</li>
                  <li>People</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="search-wrapper">
            <input type="text" placeholder="Search books" className="header-search-input" />
            <button className="search-icon-btn">🔍</button>
          </div>
        </div>

        <div className="header-right">
          <div className="header-icon-item" title="Notifications">
            <div className="icon-wrapper hover-effect">
              <span className="notification-badge">9+</span>
              <i className="fas fa-bell"></i>
            </div>
          </div>

          <div className="header-icon-item" title="Discussions">
            <div className="icon-wrapper hover-effect">
              <i className="fas fa-comments"></i>
            </div>
          </div>

          <div className="header-icon-item" title="Messages">
            <div className="icon-wrapper hover-effect">
              <i className="fas fa-envelope"></i>
            </div>
          </div>

          <div className="header-icon-item" title="Friends">
            <div className="icon-wrapper hover-effect">
              <i className="fas fa-user-friends"></i>
            </div>
          </div>

          <div className="header-user-profile" onClick={() => navigate("/profile")}>
            <img src="/avatar.jpg" alt="User" className="user-avatar-small" />
          </div>
        </div>
      </div>
    </nav>
  );
}