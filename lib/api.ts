
const API_URL = 'http://localhost:3001';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };


  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Backend-ə sorğunu göndəririk
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); 

    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API sorğusunda xəta baş verdi');
  }

  if (response.status === 204) return null;

  return await response.json();
}
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data?: any) => 
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    
  patch: (endpoint: string, data?: any) => 
    fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};