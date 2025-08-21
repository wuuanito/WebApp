const API_BASE_URL = 'http://192.168.11.7:4001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autorización si existe
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }

  // Método específico para login
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Método para logout (si existe en la API)
  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Método para verificar token
  async verifyToken() {
    return this.request('/api/auth/verify', {
      method: 'GET',
    });
  }

  // Método para refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export default new ApiService();