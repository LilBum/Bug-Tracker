const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }

  return data;
}
