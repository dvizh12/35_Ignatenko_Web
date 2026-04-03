export async function apiRequest(url, method, body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(res.statusText);

  if (method === "DELETE") return { success: true };

  return await res.json();
}
