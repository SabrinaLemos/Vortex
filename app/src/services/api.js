const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Gerenciador de Token e Sessão
export const getToken = () => localStorage.getItem('vortex_access_token');
export const setToken = (token) => localStorage.setItem('vortex_access_token', token);
export const removeToken = () => {
  localStorage.removeItem('vortex_access_token');
  localStorage.removeItem('vortex_refresh_token');
  localStorage.removeItem('vortex_usuario');
};

export const getSessionToken = () => {
  let session = localStorage.getItem('vortex_session_token');
  if (!session) {
    session = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('vortex_session_token', session);
  }
  return session;
};

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const sessionToken = getSessionToken();

  const headers = {
    'Content-Type': 'application/json',
    'X-Session-Token': sessionToken,
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Se for FormData (upload), remove Content-Type para o browser definir o boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Erro ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data?.details || [];
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Erro na requisição para ${endpoint}:`, err);
    throw err;
  }
}

const apiClient = {
  get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), headers }),
  put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
  patch: (endpoint, body, headers) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers }),
  delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers }),
};

export default apiClient;
