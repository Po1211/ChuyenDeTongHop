import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [query, setQuery] = useState("");

  const communityRef = useRef(null);
  const browseRef = useRef(null);

  /* ================= CLICK OUTSIDE DROPDOWNS ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setIsBrowseOpen(false);
      }
      if (
        communityRef.current &&
        !communityRef.current.contains(event.target)
      ) {
        setIsCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ROLE-BASED ROUTE GUARD ================= */
  useEffect(() => {
    if (!user) return;

    const path = location.pathname;

    if (user.role !== "admin" && path.startsWith("/admin")) {
      navigate("/home", { replace: true });
    }

    if (
      user.role === "admin" &&
      (path.startsWith("/profile") || path.startsWith("/mybooks"))
    ) {
      navigate("/home", { replace: true });
    }
  }, [location.pathname, user, navigate]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/home");
  };

  return (
    <nav className="main-header">
      <div className="header-inner">
        {/* LEFT */}
        <div className="header-left">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="nav-logo"
            onClick={() => navigate("/home")}
          />

          <div className="nav-menu">
            <span className="nav-link" onClick={() => navigate("/home")}>
              Home
            </span>

            {user?.role !== "admin" && (
              <span className="nav-link" onClick={() => navigate("/mybooks")}>
                My Books
              </span>
            )}

            {/* BROWSE */}
            <div className="nav-item-dropdown" ref={browseRef}>
              <span
                className={`nav-link ${isBrowseOpen ? "active-dropdown" : ""}`}
                onClick={() => {
                  setIsBrowseOpen(!isBrowseOpen);
                  setIsCommunityOpen(false);
                }}
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

            {/* COMMUNITY */}
            <div className="nav-item-dropdown" ref={communityRef}>
              <span
                className={`nav-link ${
                  isCommunityOpen ? "active-dropdown" : ""
                }`}
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

        {/* CENTER */}
        <div className="header-center">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search books"
              className="header-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query)}&type=all`);
                }
              }}
            />
            <button
              className="search-icon-btn"
              onClick={() => {
                if (query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query)}&type=all`);
                }
              }}
            >
              🔍
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="header-right">
          {user ? (
            <div className="header-user-profile">
              <div
                className="user-profile-clickable"
                onClick={() =>
                  navigate(user.role === "admin" ? "/admin" : "/profile")
                }
              >
                <img
                  src="/avatar.jpg"
                  alt="User"
                  className="user-avatar-small"
                />
                <span className="nav-link user-name">{user.full_name}</span>
              </div>

              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <span className="nav-link" onClick={() => navigate("/login")}>
              Login
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
