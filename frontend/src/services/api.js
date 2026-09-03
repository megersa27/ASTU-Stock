const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return {};
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  // Support both enveloped { success: true, data } and raw responses
  if (data && data.success !== undefined && data.data !== undefined) {
    return data.data;
  }

  return data;
};

// Add convenience helper methods
api.get = (endpoint, options = {}) => api(endpoint, { ...options, method: "GET" });
api.post = (endpoint, body, options = {}) =>
  api(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
api.put = (endpoint, body, options = {}) =>
  api(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
api.patch = (endpoint, body, options = {}) =>
  api(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
api.delete = (endpoint, options = {}) =>
  api(endpoint, { ...options, method: "DELETE" });

export default api;