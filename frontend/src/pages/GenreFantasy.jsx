import React from "react";
import Header from "../components/Header";
import "../styles/GenreFantasy.css";

// Danh sách ảnh bìa mẫu
const BOOK_COVERS = [
  { id: 1, cover: "/fantasys/F01.jpg" },
  { id: 2, cover: "/fantasys/F02.jpg" },
  { id: 3, cover: "/fantasys/F03.jpg" },
  { id: 4, cover: "/fantasys/F04.jpg" },
  { id: 5, cover: "/fantasys/F05.jpg" },
  { id: 6, cover: "/fantasys/F06.jpg" },
  { id: 7, cover: "/fantasys/F07.jpg" },
  { id: 8, cover: "/fantasys/F08.jpg" },
  { id: 9, cover: "/fantasys/F09.jpg" },
  { id: 10, cover: "/fantasys/F10.jpg" },
  { id: 11, cover: "/fantasys/F11.jpg" },
  { id: 12, cover: "/fantasys/F12.jpg" },
  { id: 13, cover: "/fantasys/F13.jpg" },
  { id: 14, cover: "/fantasys/F14.jpg" },
  { id: 15, cover: "/fantasys/F15.jpg" },
  { id: 16, cover: "/fantasys/F16.jpg" },
  { id: 17, cover: "/fantasys/F17.jpg" },
  { id: 18, cover: "/fantasys/F18.jpg" },
  { id: 19, cover: "/fantasys/F19.jpg" },
  { id: 20, cover: "/fantasys/F20.jpg" },
];

export default function GenreFantasyGrid() {
  return (
    <div className="genre-grid-page">
      <Header />
      
      <div className="grid-container-layout">
        <div className="grid-header">
          <h1 className="grid-title">Fantasy</h1>
          <p className="grid-subtitle">
            Fantasy is a genre that uses magic and other supernatural forms as a primary element of plot, theme, and/or setting. Fantasy is generally distinguished from science fiction and horror by the expectation that it steers clear of technological and macabre themes, respectively, though there is a great deal of overlap between the three (collectively known as speculative fiction or science fiction/fantasy).
            In its broadest sense, fantasy comprises works by many writers, artists, filmmakers, and musicians, from ancient myths and legends to many recent works embraced by a wide audience today, including young adults, most of whom are represented by the works below.
          </p>
        </div>

        <div className="book-only-grid">
          {BOOK_COVERS.map((book) => (
            <div key={book.id} className="cover-wrapper">
              <img src={book.cover} alt="Book Cover" className="pure-cover-img" />
              <div className="cover-overlay">
                <button className="quick-add-btn">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}