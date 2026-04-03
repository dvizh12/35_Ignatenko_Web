import { useEffect, useState } from "react";
import { API_CONFIG } from "../config/apiConfig";
import { apiRequest } from "../api/apiService";
import ApiCard from "../components/ApiCard";
import CreateForm from "../components/CreateForm";

export default function PostsPage() {
  const config = API_CONFIG.posts;
  const [data, setData] = useState([]);

  async function load() {
    const res = await apiRequest(config.base, "GET");
    setData(res.slice(0, 10));
  }

  async function create(item) {
    await apiRequest(config.base, "POST", item);
    load();
  }

  async function remove(id) {
    await apiRequest(`${config.base}/${id}`, "DELETE");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="api-panel">
      <h2>{config.title}</h2>

      <CreateForm fields={config.fields} onSubmit={create} />

      <div className="card-list">
        {data.map(item => (
          <ApiCard key={item.id} item={item} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}
