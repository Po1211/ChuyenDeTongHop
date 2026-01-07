import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [me, setMe] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [alert, setAlert] = useState(null);
  const [isWantToRead, setIsWantToRead] = useState(false);

  /* ================= CURRENT USER ================= */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setMe);
  }, []);

  /* ================= BOOK DETAILS ================= */
  useEffect(() => {
    fetch(`/api/books/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setIsWantToRead(Boolean(data.is_want_to_read));
      });
  }, [id]);

  /* ================= REVIEWS ================= */
  const loadReviews = () => {
    fetch(`/api/books/${id}/reviews?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
        setHasMore(data.hasMore);
      });
  };

  useEffect(loadReviews, [id, page]);

  if (!book) return null;

  // ✅ Normalize backend cover image URL
  const coverUrl = book.cover_image_url
    ? `http://localhost:4000${book.cover_image_url}`
    : "/cover.jpg";

  const myReview = me ? reviews.find((r) => r.user_id === me.id) : null;

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ================= WANT TO READ TOGGLE ================= */
  const toggleWantToRead = () => {
    fetch(`/api/books/${id}/want-to-read`, {
      method: isWantToRead ? "DELETE" : "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setIsWantToRead(!isWantToRead);
        showAlert(
          "success",
          isWantToRead ? "Removed from Want to Read" : "Added to Want to Read"
        );
      })
      .catch(() => showAlert("error", "You must be logged in"));
  };

  return (
    <div className="book-details-page">
      <Header />

      <div className="details-container">
        {/* LEFT */}
        <aside className="details-left-col">
          <div className="sticky-sidebar">
            <img src={coverUrl} alt={book.title} className="main-book-cover" />

            <button
              className={`btn-wtr-full ${isWantToRead ? "added" : ""}`}
              onClick={toggleWantToRead}
            >
              {isWantToRead ? "Added to Want to Read" : "Want to Read"}
            </button>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="details-right-col">
          {/* HEADER */}
          <section className="main-book-header">
            <h1 className="book-title-display">{book.title}</h1>
            <p className="book-author-display">
              by <span className="author-name">{book.author_name}</span>
            </p>

            <div className="rating-summary-row">
              <span className="stars-fill">★★★★☆</span>
              <span className="avg-rating-bold">
                {Number(book.avg_rating).toFixed(2)}
              </span>
              <span className="dot-sep">·</span>
              <span className="review-count">{book.total_reviews} reviews</span>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="book-description-section">
            <p className="description-text">
              {book.description || "No description available."}
            </p>

            <div className="book-details-table">
              <div className="detail-row">
                <span className="detail-label">Pages</span>
                <span className="detail-value">{book.total_pages}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Published</span>
                <span className="detail-value">
                  {book.publication_year} · {book.publisher}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ISBN</span>
                <span className="detail-value">{book.isbn}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Language</span>
                <span className="detail-value">{book.language}</span>
              </div>
            </div>

            <div className="book-genres-row">
              <span className="meta-label">Genres</span>
              <nav className="genre-tags">
                {book.categories?.map((g, i) => (
                  <span key={i} onClick={() => navigate("/genrefantasy")}>
                    {g}
                  </span>
                ))}
              </nav>
            </div>
          </section>

          <hr className="section-divider" />

          {/* ALERT */}
          {alert && (
            <div className={`alert-box ${alert.type}`}>{alert.text}</div>
          )}

          {/* WRITE / EDIT REVIEW */}
          {me && (
            <div className="my-review-status">
              <div className="review-prompt">
                <p>{myReview ? "Edit your review" : "What do you think?"}</p>

                <div className="stars-outline-big">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setRating(s)}
                      style={{
                        color: s <= rating ? "#dcb14a" : "#ccc",
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                />

                <button
                  className="btn-write-review"
                  onClick={() => {
                    const method = myReview ? "PUT" : "POST";
                    const url = myReview
                      ? `/api/books/reviews/${myReview.id}`
                      : `/api/books/${id}/reviews`;

                    fetch(url, {
                      method,
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        rating,
                        review_text: reviewText,
                      }),
                    })
                      .then((res) => {
                        if (!res.ok) throw new Error();
                        showAlert(
                          "success",
                          myReview ? "Review updated" : "Review posted"
                        );
                        setReviewText("");
                        setRating(0);
                        setPage(1);
                        loadReviews();
                      })
                      .catch(() => showAlert("error", "Unable to save review"));
                  }}
                >
                  {myReview ? "Save Review" : "Post Review"}
                </button>
              </div>
            </div>
          )}

          <hr className="section-divider" />

          {/* REVIEWS */}
          <section className="reviews-section">
            <h3 className="section-header">COMMUNITY REVIEWS</h3>

            {reviews.map((r) => {
              const isOwner = me && me.id === r.user_id;
              const isAdmin = me && me.role === "admin";

              return (
                <div key={r.id} className="review-item">
                  <div className="review-user">
                    <img
                      src={r.avatar_url || "/avatar.jpg"}
                      className="user-avatar-mini"
                      alt="User"
                    />
                    <strong>{r.full_name}</strong> rated ★{r.rating}
                  </div>

                  <p className="review-content">{r.review_text}</p>

                  <div className="review-footer">
                    {new Date(r.created_at).toLocaleDateString()}

                    {(isOwner || isAdmin) && (
                      <button
                        onClick={() =>
                          fetch(`/api/books/reviews/${r.id}`, {
                            method: "DELETE",
                            credentials: "include",
                          })
                            .then((res) => {
                              if (!res.ok) throw new Error();
                              showAlert("success", "Review deleted");
                              loadReviews();
                            })
                            .catch(() =>
                              showAlert("error", "Permission denied")
                            )
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* PAGINATION */}
            <div>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>

              <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
