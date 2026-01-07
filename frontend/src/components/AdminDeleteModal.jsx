    export default function AdminDeleteModal({
      mode,
      record,
      onClose,
      onDeleted,
    }) {
      const handleDelete = async () => {
        await fetch(`http://localhost:4000/api/admin/${mode}/${record.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        onClose();
        onDeleted();
      };

      return (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Confirm delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{record.title || record.name}</strong>?
            </p>

            <div className="admin-modal-actions">
              <button onClick={onClose}>Cancel</button>
              <button className="danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }
