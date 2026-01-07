import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import "../styles/MyBooks.css";

export default function MyBooks() {
  /* ================= STATE ================= */
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [activeShelf, setActiveShelf] = useState("all");
  const [query, setQuery] = useState("");
  const [newShelfName, setNewShelfName] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  const [manageShelves, setManageShelves] = useState(false);
  const [selectedShelves, setSelectedShelves] = useState([]);
  const [renamingShelf, setRenamingShelf] = useState(null);
  const [shelfError, setShelfError] = useState("");

  const modalRef = useRef(null);

  /* ================= HELPERS ================= */
  const isDefaultShelf = (shelf) =>
    ["want_to_read", "reading", "read"].includes(shelf.key);

  /* ================= LOAD BOOKS + SHELVES ================= */
  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const params = new URLSearchParams();
      if (activeShelf !== "all") params.append("shelf", activeShelf);
      if (query) params.append("q", query);

      const [booksRes, shelvesRes] = await Promise.all([
        fetch(`/api/mybooks?${params.toString()}`, {
          credentials: "include",
        }),
        fetch("/api/mybooks/shelves", {
          credentials: "include",
        }),
      ]);

      const booksData = await booksRes.json();
      const shelvesData = await shelvesRes.json();

      if (!ignore) {
        setBooks(booksData);
        setShelves(shelvesData);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [activeShelf, query]);

  // ADD THIS FUNCTION
  const isDuplicateShelfName = (name) => {
    const normalized = name.trim().toLowerCase();

    return shelves.some((s) => {
      // allow same name when renaming itself
      if (renamingShelf?.id && s.id === renamingShelf.id) return false;

      return s.label.trim().toLowerCase() === normalized;
    });
  };

  /* ================= CLICK OUTSIDE MODAL ================= */
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditingBook(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= ACTIONS ================= */
  const saveEdit = async () => {
    await fetch(`/api/mybooks/${editingBook.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBook),
    });

    setEditingBook(null);
    window.location.reload();
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Remove this book from all shelves and reviews?"))
      return;

    await fetch(`/api/mybooks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const renderStars = (rating, avg) => {
    const count = rating > 0 ? rating : Math.round(avg);
    return (
      <span className={`stars ${rating === 0 ? "faded" : ""}`}>
        {"★".repeat(count)}
      </span>
    );
  };

  /* ================= RENDER ================= */
  return (
    <>
      <Header />

      <div className="mybooks-screen">
        <div className="mybooks-content">
          {/* ================= LEFT ================= */}
          <aside className="mybooks-left">
            <div className="card-box">
              <div className="section-title">Bookshelves</div>

              <div className="shelf-link-item">
                <button
                  className={`shelf-link ${
                    activeShelf === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveShelf("all")}
                >
                  All ({shelves.reduce((sum, s) => sum + s.count, 0)})
                </button>
              </div>

              <div className="mybooks-shelf-list">
                {shelves.map((s) => {
                  const isDefault = isDefaultShelf(s);

                  return (
                    <div key={s.id} className="shelf-link-item shelf-row-flex">
                      {manageShelves && !isDefault && (
                        <input
                          type="checkbox"
                          checked={selectedShelves.includes(s.id)}
                          onChange={(e) => {
                            setSelectedShelves((prev) =>
                              e.target.checked
                                ? [...prev, s.id]
                                : prev.filter((x) => x !== s.id)
                            );
                          }}
                        />
                      )}

                      <button
                        className={`shelf-link ${
                          activeShelf === s.key ? "active" : ""
                        }`}
                        disabled={manageShelves}
                        onClick={() => setActiveShelf(s.key)}
                      >
                        {s.label} ({s.count})
                      </button>

                      {manageShelves && !isDefault && (
                        <button
                          className="rename-btn"
                          onClick={() => {
                            setRenamingShelf(s);
                            setNewShelfName(s.label);
                          }}
                        >
                          ✎
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                className="manage-shelves-btn"
                onClick={() => {
                  setManageShelves(!manageShelves);
                  setSelectedShelves([]);
                }}
              >
                {manageShelves ? "Done" : "Manage shelves"}
              </button>

              {manageShelves && selectedShelves.length > 0 && (
                <button
                  className="delete-shelves-btn"
                  onClick={async () => {
                    if (!window.confirm("Delete selected shelves?")) return;

                    await fetch("/api/mybooks/shelves", {
                      method: "DELETE",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ shelfIds: selectedShelves }),
                    });

                    window.location.reload();
                  }}
                >
                  Delete selected
                </button>
              )}

              <hr />

              <button
                className="add-shelf-btn"
                onClick={() => {
                  setRenamingShelf({ id: null });
                  setNewShelfName("");
                }}
              >
                Add shelf
              </button>
            </div>
          </aside>

          {/* ================= MAIN ================= */}
          <main className="mybooks-main">
            <div className="card-box">
              <div className="mybooks-header">
                <input
                  className="search-input"
                  placeholder="Search your books"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="table-container">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th className="th-cover">cover</th>
                      <th className="th-title">title</th>
                      <th className="th-author">author</th>
                      <th className="th-center">avg rating</th>
                      <th className="th-center">rating</th>
                      <th className="th-left">shelves</th>
                      <th className="th-left">review</th>
                      <th className="th-left">date added</th>
                      <th className="th-actions">actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {books.map((b) => (
                      <tr key={b.id} className="book-row">
                        <td>
                          <img
                            src={
                              b.cover_image_url
                                ? `http://localhost:4000${b.cover_image_url}`
                                : "/book-placeholder.png"
                            }
                            alt={b.title}
                            className="book-cover-img"
                          />
                        </td>

                        <td>
                          <a
                            href={`/bookdetails/${b.id}`}
                            className="book-title-link"
                          >
                            {b.title}
                          </a>
                        </td>

                        <td>{b.author}</td>

                        <td className="td-center">{b.avg_rating}</td>

                        <td className="td-center">
                          {renderStars(b.rating, b.avg_rating)}
                        </td>

                        <td>{b.shelves.join(", ")}</td>

                        <td className="td-review">
                          {b.review ? (
                            <span title={b.review}>
                              {b.review.length > 60
                                ? b.review.slice(0, 60) + "…"
                                : b.review}
                            </span>
                          ) : (
                            <span className="review-empty">—</span>
                          )}
                        </td>

                        <td>{new Date(b.added_at).toLocaleDateString()}</td>

                        <td className="td-actions">
                          <div className="action-links">
                            <button
                              className="action-link"
                              onClick={() => setEditingBook({ ...b })}
                            >
                              edit
                            </button>
                            <span>|</span>
                            <a
                              href={`/bookdetails/${b.id}`}
                              className="action-link"
                            >
                              view
                            </a>
                            <span>|</span>
                            <button
                              className="delete-btn"
                              onClick={() => deleteBook(b.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ================= EDIT BOOK MODAL ================= */}
      {editingBook && (
        <div className="modal-backdrop">
          <div className="modal-box" ref={modalRef}>
            <h3 className="modal-title">Edit Book</h3>

            <div className="modal-form">
              <div className="modal-field">
                <label>Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={editingBook.rating || 0}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      rating: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="modal-field">
                <label>Review</label>
                <textarea
                  rows="3"
                  value={editingBook.review || ""}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      review: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-field">
                <label>Shelves</label>
                <div className="modal-shelf-list">
                  {shelves.map((s) => (
                    <label key={s.key} className="modal-shelf-item">
                      <input
                        type="checkbox"
                        checked={editingBook.shelves.includes(s.key)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...editingBook.shelves, s.key]
                            : editingBook.shelves.filter((x) => x !== s.key);

                          setEditingBook({
                            ...editingBook,
                            shelves: next,
                          });
                        }}
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-save" onClick={saveEdit}>
                Save
              </button>
              <button
                className="modal-cancel"
                onClick={() => setEditingBook(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / RENAME SHELF MODAL ================= */}
      {renamingShelf && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>{renamingShelf.id ? "Rename Shelf" : "Add Shelf"}</h3>

            <input
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              placeholder="Shelf name"
            />

            {shelfError && <div className="form-error-text">{shelfError}</div>}

            <div className="modal-actions">
              <button
                onClick={async () => {
                  const name = newShelfName.trim();

                  // 🔒 empty check
                  if (!name) {
                    setShelfError("Shelf name is required.");
                    return;
                  }

                  // 🔒 duplicate check
                  if (isDuplicateShelfName(name)) {
                    setShelfError("A shelf with this name already exists.");
                    return;
                  }

                  // ✅ clear error
                  setShelfError("");

                  if (renamingShelf.id) {
                    await fetch(`/api/mybooks/shelves/${renamingShelf.id}`, {
                      method: "PUT",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name }),
                    });
                  } else {
                    await fetch("/api/mybooks/shelves", {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name }),
                    });
                  }

                  window.location.reload();
                }}
              >
                Save
              </button>

              <button onClick={() => setRenamingShelf(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
