import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GenreSelection.css";

const GENRES = [
  "Art", "Biography", "Business", "Chick Lit", "Children's", "Christian", 
  "Classics", "Comics", "Contemporary", "Cookbooks", "Crime", "Ebooks", 
  "Fantasy", "Fiction", "Gay and Lesbian", "Graphic Novels", "Historical Fiction", 
  "History", "Horror", "Humor and Comedy", "Manga", "Memoir", "Music", "Mystery"
];

export default function GenreSelection() {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="selection-screen">
      <div className="selection-container">
        <div className="logo-section" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="Logo" className="large-logo" />
        </div>

        <h1 className="selection-title">Select your favorite genres</h1>
        <p className="selection-subtitle">Select at least 1 genre to continue</p>

        <div className="genres-wrapper">
          {GENRES.map((genre) => (
            <div 
              key={genre} 
              className={`genre-chip ${selectedGenres.includes(genre) ? "active" : ""}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
              {selectedGenres.includes(genre) && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>

        <button 
          className={`btn-continue ${selectedGenres.length > 0 ? "enabled" : ""}`}
          disabled={selectedGenres.length === 0}
          onClick={() => navigate("/Home")}
        >
          Continue
        </button>

        <footer className="footer-links-area">
          <p className="copyright">© 2025 Company's Name, Inc.</p>
        </footer>
      </div>
    </div>
  );
}