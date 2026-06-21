const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("sb_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = payload.error || response.statusText || "Request failed";
    throw new Error(error);
  }

  return response.json();
}
