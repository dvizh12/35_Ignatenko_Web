export default function ApiCard({ item, onDelete }) {
  return (
    <div className="data-card">
      <h4>{item.title || item.name}</h4>
      <p>{item.body}</p>

      <div className="card-actions">
        <button className="small danger" onClick={() => onDelete(item.id)}>
          🗑 Удалить
        </button>
      </div>
    </div>
  );
}
