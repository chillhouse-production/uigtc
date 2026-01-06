// services/api.ts
const API_BASE_URL = 'https://uigtc.id/api';

export async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  isFormData = false
): Promise<{ data: T; ok: boolean }> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const data = await res.json();
  return { data, ok: res.ok };
}
