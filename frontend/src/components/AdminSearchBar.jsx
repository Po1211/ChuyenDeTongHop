export default function AdminSearchBar({ value, onChange }) {
  return (
    <input
      className="admin-search"
      placeholder="Search…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
