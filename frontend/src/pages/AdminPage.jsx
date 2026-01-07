import { useEffect, useState } from "react";
import Header from "../components/Header";
import AdminSearchBar from "../components/AdminSearchBar";
import AdminTable from "../components/AdminTable";
import AdminFormModal from "../components/AdminFormModal";
import AdminDeleteModal from "../components/AdminDeleteModal";
import ImagePreviewModal from "../components/ImagePreviewModal";
import "../styles/AdminPage.css";

export default function AdminPage() {
  const [mode, setMode] = useState("books");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    fetch("http://localhost:4000/api/admin/categories", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) setCategories(res);
        else if (Array.isArray(res.data)) setCategories(res.data);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  /* ================= FETCH DATA ================= */
  const fetchData = () => {
    const genreQuery = genreFilter ? `&genre=${genreFilter}` : "";

    fetch(`http://localhost:4000/api/admin/${mode}?page=${page}${genreQuery}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setTotal(res.total || 0);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [mode, page, genreFilter]);

  /* ================= ADD BUTTON ================= */
  const handleAdd = () => {
    if (mode === "books") {
      setEditing({
        id: null,
        isbn: "",
        title: "",
        author_id: "",
        description: "",
        cover_image_url: "",
        publication_year: "",
        publisher: "",
        total_pages: "",
        language: "en",
        genres: [],
      });
    } else {
      setEditing({
        id: null,
        name: "",
        biography: "",
        photo_url: "",
        birth_date: "",
        nationality: "",
      });
    }
  };

  /* ================= SEARCH ================= */
  const filtered = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / 10);

  return (
    <>
      <Header />

      <div className="admin-page">
        {/* ===== HEADER ===== */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>

          <div className="admin-toggle">
            <button
              className={mode === "books" ? "active" : ""}
              onClick={() => {
                setMode("books");
                setPage(1);
              }}
            >
              Books
            </button>

            <button
              className={mode === "authors" ? "active" : ""}
              onClick={() => {
                setMode("authors");
                setPage(1);
              }}
            >
              Authors
            </button>
          </div>
        </div>

        {/* ===== TOOLBAR ===== */}
        <div className="admin-toolbar">
          <AdminSearchBar value={search} onChange={setSearch} />

          {mode === "books" && (
            <select
              value={genreFilter}
              onChange={(e) => {
                setGenreFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All genres</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <button className="admin-add-btn" onClick={handleAdd}>
            + Add {mode === "books" ? "Book" : "Author"}
          </button>
        </div>

        {/* ===== TABLE ===== */}
        <AdminTable
          mode={mode}
          data={filtered}
          onEdit={setEditing}
          onDelete={setDeleting}
          onPreviewImage={setPreviewImage}
        />

        {/* ===== PAGINATION ===== */}
        <div className="admin-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>

          <span>
            Page {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {editing !== null && (
        <AdminFormModal
          mode={mode}
          record={editing}
          onClose={() => setEditing(null)}
          onSaved={fetchData}
        />
      )}

      {deleting && (
        <AdminDeleteModal
          mode={mode}
          record={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={fetchData}
        />
      )}

      {previewImage && (
        <ImagePreviewModal
          src={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}
