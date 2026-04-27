/**
 * AgroCare — Centralized API Helper
 * All backend calls go through this module.
 * Automatically attaches the JWT Bearer token from localStorage.
 */

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

/**
 * Make an authenticated JSON API call to the backend.
 * @param {string} endpoint - API path (e.g. "/api/auth/login")
 * @param {object} options  - fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}  - parsed JSON response
 */
export async function apiCall(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("agrocare_token")
      : null;

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = error.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((d) => d.msg || d.message || JSON.stringify(d))
              .join("; ")
          : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Shorthand for GET requests.
 */
export function apiGet(endpoint) {
  return apiCall(endpoint, { method: "GET" });
}

/**
 * Shorthand for POST requests with JSON body.
 */
export function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Shorthand for PUT requests with JSON body.
 */
export function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Shorthand for DELETE requests.
 */
export function apiDelete(endpoint) {
  return apiCall(endpoint, { method: "DELETE" });
}
