const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const isFormData = body instanceof FormData;

  const headers = {
    // Only set JSON header if not uploading multipart FormData
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...customConfig.headers,
  };

  const config = {
    method: body ? 'POST' : 'GET',
    // CRITICAL: Tells the browser to send & store JSESSIONID / HTTP-only cookies
    credentials: 'include',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  // Handle 204 No Content safely
  if (response.status === 204) return null;

  return response.json();
}