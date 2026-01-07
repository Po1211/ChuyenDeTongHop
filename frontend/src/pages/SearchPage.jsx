import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeQuery = searchParams.get("q");
  const activeType = searchParams.get("type") || "all";

  /* ================= FETCH SEARCH RESULTS ================= */
  useEffect(() => {
    if (!activeQuery?.trim()) return;

    let cancelled = false;

    fetch(
      `http://localhost:4000/api/books/search?q=${encodeURIComponent(
        activeQuery
      )}&type=${activeType}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeQuery, activeType]);

  /* ================= HANDLE SEARCH ================= */
  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearchParams({ q: query, type });
  };

  return (
    <div className="search-page">
      <Header />

      <div className="search-container">
        <main className="search-results-main">
          <h1 className="page-title">Search</h1>

          {/* SEARCH BOX */}
          <div className="search-filter-box">
            <div className="search-input-row">
              <input
                type="text"
                placeholder="Title / Author / ISBN"
                className="main-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="main-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="search-options-row">
              <label className="radio-option">
                <input
                  type="radio"
                  name="search-type"
                  checked={type === "all"}
                  onChange={() => setType("all")}
                />
                <span className="radio-custom"></span> all
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="search-type"
                  checked={type === "title"}
                  onChange={() => setType("title")}
                />
                <span className="radio-custom"></span> title
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="search-type"
                  checked={type === "author"}
                  onChange={() => setType("author")}
                />
                <span className="radio-custom"></span> author
              </label>
            </div>
          </div>

          {/* RESULTS INFO */}
          {loading && <p className="results-count">Searching…</p>}

          {!loading && results.length > 0 && (
            <p className="results-count">Showing {results.length} results</p>
          )}

          {!loading && !results.length && activeQuery && (
            <p className="results-count">No results found</p>
          )}

          {/* RESULTS LIST */}
          <div className="results-list">
            {results.map((book) => (
              <div
                key={book.id}
                className="search-book-item"
                onClick={() => window.open(`/bookdetails/${book.id}`, "_blank")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="search-book-cover"
                />

                <div className="search-book-info">
                  <h3 className="search-book-title">{book.title}</h3>
                  <p className="search-book-author">by {book.author}</p>

                  <div className="search-book-rating">
                    <span className="stars-red">★★★★☆</span>
                    <span className="rating-stats">
                      {book.rating ?? "—"} avg rating — {book.votes} ratings —
                      published {book.published_year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
