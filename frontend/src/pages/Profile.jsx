import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shelfCounts, setShelfCounts] = useState({
    read: 0,
    reading: 0,
    want_to_read: 0,
  });

  const [customShelves, setCustomShelves] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  // ✅ ONE dropdown open at a time (by book_id)
  const [openBookId, setOpenBookId] = useState(null);
  const dropdownRef = useRef(null);

  /* ================= USER ================= */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser);
  }, []);

  /* ================= PROFILE SUMMARY ================= */
  const loadSummary = () => {
    fetch("/api/profile/summary", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setShelfCounts(data.shelf_counts);
        setCustomShelves(data.custom_shelves);
        setCurrentlyReading(data.currentlyReading);
        setRecentActivity(data.recentActivity);
        setFavoriteGenres(data.favorite_genres);
      });
  };

  useEffect(loadSummary, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenBookId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  /* ================= STATUS CHANGE ================= */
  const changeStatus = async (bookId, shelfType) => {
    await fetch(`/api/books/${bookId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelf_type: shelfType }),
    });

    setOpenBookId(null);
    loadSummary();
  };

  /* ================= STATUS BUTTON ================= */
  const StatusButton = ({ book }) => {
    const isOpen = openBookId === book.book_id;

    const shelfLabel =
      book.shelf_type === "reading"
        ? "Currently Reading"
        : book.shelf_type === "read"
        ? "Read"
        : "Want to Read";

    return (
      <div className="status-wrapper" ref={dropdownRef}>
        <button
          className="status-btn green"
          onClick={() => setOpenBookId(isOpen ? null : book.book_id)}
        >
          ✓ {shelfLabel} ▾
        </button>

        {isOpen && (
          <div className="status-dropdown">
            {[
              { key: "want_to_read", label: "Want to Read" },
              { key: "reading", label: "Currently Reading" },
              { key: "read", label: "Read" },
            ].map((s) => (
              <div
                key={s.key}
                className={`status-option ${
                  book.shelf_type === s.key ? "active" : ""
                }`}
                onClick={() =>
                  book.shelf_type !== s.key && changeStatus(book.book_id, s.key)
                }
              >
                {s.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="profile-screen">
        <div className="profile-content">
          {/* ================= LEFT ================= */}
          <aside className="profile-left">
            <div className="card-box">
              <img
                src={user.avatar_url || "/avatar.jpg"}
                alt="User"
                className="profile-avatar"
              />
              <div className="profile-name">{user.full_name}</div>
              <div className="profile-meta">
                Member since {new Date(user.created_at).getFullYear()}
              </div>
            </div>

            <div className="card-box">
              <div className="section-title">Status</div>

              <div className="shelf-row">
                <span className="count-num">{shelfCounts.read}</span>
                <span className="shelf-link">Read</span>
              </div>

              <div className="shelf-row">
                <span className="count-num">{shelfCounts.reading}</span>
                <span className="shelf-link">Currently Reading</span>
              </div>

              <div className="shelf-row">
                <span className="count-num">{shelfCounts.want_to_read}</span>
                <span className="shelf-link">Want to Read</span>
              </div>

              <hr />

              <div className="section-title">Your Bookshelves</div>

              {customShelves.map((s) => (
                <div key={s.id} className="shelf-row">
                  <span className="count-num">{s.count}</span>
                  <span className="shelf-link">{s.name}</span>
                </div>
              ))}

              {/* ✅ MORE LINK */}
              <div className="card-footer-action right">
                <span
                  className="footer-link"
                  onClick={() => navigate("/mybooks")}
                >
                  More…
                </span>
              </div>
            </div>
          </aside>

          {/* ================= MAIN ================= */}
          <main className="profile-main">
            {/* ===== Currently Reading ===== */}
            <div className="home-card-section">
              <div className="home-card-title">Currently Reading</div>

              {currentlyReading.map((b) => (
                <div key={b.book_id} className="activity-card">
                  <div className="activity-container-flex">
                    <div className="activity-book-cover-col">
                      <img
                        src={
                          b.cover_image_url
                            ? `http://localhost:4000${b.cover_image_url}`
                            : "/book-placeholder.png"
                        }
                        alt={b.title}
                        className="feed-book-cover"
                      />
                    </div>

                    <div className="activity-info-col">
                      <div className="activity-text">
                        <span className="user-name">{user.full_name}</span>
                        <span className="dot"> · </span>
                        is currently reading
                      </div>

                      <a
                        href={`/bookdetails/${b.book_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-name-link"
                      >
                        {b.title}
                      </a>

                      <div className="activity-time">
                        {new Date(b.added_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="activity-right-col">
                      <StatusButton book={{ ...b, shelf_type: "reading" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== Recent Activity (READ-ONLY) ===== */}
            <div className="home-card-section">
              <div className="home-card-title">Recent Activity</div>

              {recentActivity.map((a) => (
                <div
                  key={`${a.book_id}-${a.time}-${a.action}`}
                  className="activity-card"
                >
                  <div className="activity-container-flex">
                    <div className="activity-book-cover-col">
                      <img
                        src={
                          a.cover_image_url
                            ? `http://localhost:4000${a.cover_image_url}`
                            : "/book-placeholder.png"
                        }
                        alt={a.title}
                        className="feed-book-cover"
                      />
                    </div>

                    <div className="activity-info-col">
                      <div className="activity-text">
                        <span className="user-name">{user.full_name}</span>
                        <span className="dot"> · </span>
                        {a.action}
                      </div>

                      <a
                        href={`/bookdetails/${a.book_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="book-name-link"
                      >
                        {a.title}
                      </a>

                      <div className="activity-time">
                        {new Date(a.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* ================= RIGHT ================= */}
          <aside className="profile-right">
            <div className="card-box">
              <div className="section-title">About</div>
              <p className="about-text">{user.bio || "No bio provided."}</p>
            </div>

            <div className="card-box">
              <div className="section-title">Favorite Genres</div>
              <p className="about-text">
                {favoriteGenres.length
                  ? favoriteGenres.join(", ")
                  : "None selected"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
