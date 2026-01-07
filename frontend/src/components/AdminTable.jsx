export default function AdminTable({
  data,
  mode,
  onEdit,
  onDelete,
  onPreviewImage,
}) {
  if (!data.length) return <p>No records</p>;

  // ❌ hide internal-only fields
  const hiddenColumns = ["created_at", "updated_at", "genre_ids", "genres_ids"];

  const columns = Object.keys(data[0]).filter(
    (k) => !hiddenColumns.includes(k)
  );

  const openBookDetails = (id) => {
    window.open(`/bookdetails/${id}`, "_blank");
  };

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td
                  key={c}
                  className={
                    c === "description" ? "admin-description-cell" : ""
                  }
                >
                  {/* Cover image */}
                  {mode === "books" && c === "cover_image_url" ? (
                    <img
                      src={`http://localhost:4000${row[c]}`}
                      className="admin-book-cover"
                      onClick={() =>
                        onPreviewImage(`http://localhost:4000${row[c]}`)
                      }
                    />
                  ) : /* Clickable title */ mode === "books" &&
                    c === "title" ? (
                    <span
                      className="admin-link"
                      onClick={() => openBookDetails(row.id)}
                    >
                      {row[c]}
                    </span>
                  ) : /* Genres (names only) */ c === "genres" ? (
                    Array.isArray(row.genres) ? (
                      row.genres.join(", ")
                    ) : (
                      row.genres
                    )
                  ) : (
                    row[c]
                  )}
                </td>
              ))}

              <td className="admin-action-cell">
                <button onClick={() => onEdit(row)}>Edit</button>
                <button onClick={() => onDelete(row)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
