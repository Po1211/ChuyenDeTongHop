import { useEffect, useState } from "react";

const CURRENT_YEAR = 2026;

export default function AdminFormModal({ mode, record, onClose, onSaved }) {
  const isEdit = record && record.id !== null;

  const [form, setForm] = useState({ ...record });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(
    Array.isArray(record?.genre_ids) ? record.genre_ids : []
  );

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD DEPENDENCIES ================= */
  useEffect(() => {
    if (mode === "books") {
      fetch("http://localhost:4000/api/admin/authors", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) => setAuthors(Array.isArray(res) ? res : res.data || []));

      fetch("http://localhost:4000/api/admin/categories", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) =>
          setCategories(Array.isArray(res) ? res : res.data || [])
        );
    }
  }, [mode]);

  useEffect(() => {
    if (Array.isArray(record?.genre_ids)) {
      setSelectedGenres(record.genre_ids);
    } else {
      setSelectedGenres([]);
    }
  }, [record?.id]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (file) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("cover", file);

    setUploading(true);

    const res = await fetch("http://localhost:4000/api/upload/cover", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const data = await res.json();
    setForm((f) => ({ ...f, cover_image_url: data.url }));
    setUploading(false);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};

    if (!form.title) e.title = "Title is required";
    if (!form.isbn) e.isbn = "ISBN is required";
    if (form.isbn && !/^\d+$/.test(form.isbn))
      e.isbn = "ISBN must contain numbers only";

    if (!form.author_id) e.author_id = "Author is required";
    if (!form.description) e.description = "Description is required";

    if (!form.publication_year)
      e.publication_year = "Publication year is required";
    else if (
      Number(form.publication_year) > CURRENT_YEAR ||
      Number(form.publication_year) < 1000
    )
      e.publication_year = `Year must be ≤ ${CURRENT_YEAR}`;

    if (!form.publisher) e.publisher = "Publisher is required";

    if (!form.total_pages || Number(form.total_pages) <= 0)
      e.total_pages = "Total pages must be greater than 0";

    if (!form.language) e.language = "Language is required";

    if (!isEdit && !form.cover_image_url)
      e.cover_image_url = "Cover image is required";

    if (!selectedGenres.length) e.genres = "Select at least one genre";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      genres: selectedGenres,
    };

    delete payload.author;

    const url = isEdit
      ? `http://localhost:4000/api/admin/${mode}/${record.id}`
      : `http://localhost:4000/api/admin/${mode}`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    onClose();
    onSaved();
  };

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-modal-large">
        <h3>{isEdit ? "Edit" : "Add"} Book</h3>

        <input
          className={errors.title ? "error-input" : ""}
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <input
          className={errors.isbn ? "error-input" : ""}
          placeholder="ISBN"
          value={form.isbn || ""}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
        />
        {errors.isbn && <p className="error-text">{errors.isbn}</p>}

        <textarea
          className={`admin-description-input ${
            errors.description ? "error-input" : ""
          }`}
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}

        <select
          className={errors.author_id ? "error-input" : ""}
          value={form.author_id || ""}
          onChange={(e) =>
            setForm({ ...form, author_id: Number(e.target.value) })
          }
        >
          <option value="">Select author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {errors.author_id && <p className="error-text">{errors.author_id}</p>}

        <input
          className={errors.publication_year ? "error-input" : ""}
          type="number"
          placeholder="Publication Year"
          value={form.publication_year || ""}
          onChange={(e) =>
            setForm({ ...form, publication_year: e.target.value })
          }
        />
        {errors.publication_year && (
          <p className="error-text">{errors.publication_year}</p>
        )}

        <input
          className={errors.publisher ? "error-input" : ""}
          placeholder="Publisher"
          value={form.publisher || ""}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
        />
        {errors.publisher && <p className="error-text">{errors.publisher}</p>}

        <input
          className={errors.total_pages ? "error-input" : ""}
          type="number"
          placeholder="Total Pages"
          value={form.total_pages || ""}
          onChange={(e) => setForm({ ...form, total_pages: e.target.value })}
        />
        {errors.total_pages && (
          <p className="error-text">{errors.total_pages}</p>
        )}

        <input
          className={errors.language ? "error-input" : ""}
          placeholder="Language"
          value={form.language || ""}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        />
        {errors.language && <p className="error-text">{errors.language}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {errors.cover_image_url && (
          <p className="error-text">{errors.cover_image_url}</p>
        )}

        {form.cover_image_url && (
          <img
            src={`http://localhost:4000${form.cover_image_url}`}
            className="admin-cover-preview"
          />
        )}

        <div className="genre-select">
          <p>Genres</p>
          <div className="genre-select-list">
            {categories.map((c) => (
              <label key={c.id} className="genre-select-item">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(c.id)}
                  onChange={() =>
                    setSelectedGenres((g) =>
                      g.includes(c.id)
                        ? g.filter((x) => x !== c.id)
                        : [...g, c.id]
                    )
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
          {errors.genres && <p className="error-text">{errors.genres}</p>}
        </div>

        <div className="admin-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={uploading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
