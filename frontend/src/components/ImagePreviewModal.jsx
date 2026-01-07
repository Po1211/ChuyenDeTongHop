export default function ImagePreviewModal({ src, onClose }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="image-preview-modal">
        <img src={src} />
      </div>
    </div>
  );
}
