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

  // Métodos para gestión de órdenes
  
  /**
   * Iniciar una orden de producción
   * @param {number} orderId - ID de la orden a iniciar
   * @returns {Promise} Resultado de la operación
   */
  async startOrder(orderId) {
    const url = `http://localhost:8020/order/${orderId}/start`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Orden iniciada:', result);
      return result;
    } catch (error) {
      console.error('Error al iniciar orden:', error);
      throw error;
    }
  }

  /**
   * Iniciar una orden con hora específica (para testing)
   * @param {number} orderId - ID de la orden a iniciar
   * @param {string} horaInicio - Hora de inicio en formato ISO (ej: "2024-01-15T08:00:00")
   * @returns {Promise} Resultado de la operación
   */
  async testStartOrder(orderId, horaInicio) {
    const url = `http://localhost:8020/order/${orderId}/test-start`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          horaInicio: horaInicio
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Orden de testing iniciada:', result);
      return result;
    } catch (error) {
      console.error('Error al iniciar orden de testing:', error);
      throw error;
    }
  }

  /**
   * Pausar una orden de producción
   * @param {number} codOrden - Código de la orden a pausar
   * @param {string} tipoPausa - Tipo de pausa ("mantenimiento", "cambio_formato", "falta_material", "averia", "descanso", "otros")
   * @param {string} descripcion - Descripción de la pausa
   * @param {string} usuario - Usuario que realiza la pausa
   * @param {boolean} computa - Si cuenta para cálculo OEE (default: true)
   * @returns {Promise} Resultado de la operación
   */
  async pauseOrder(codOrden, tipoPausa, descripcion, usuario, computa = true) {
    const url = 'http://localhost:8020/pause/start';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codOrden: codOrden,
          tipo: tipoPausa,
          descripcion: descripcion,
          computa: computa,
          createdBy: usuario
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Pausa iniciada:', result);
      return result;
    } catch (error) {
      console.error('Error al pausar orden:', error);
      throw error;
    }
  }

  /**
   * Reanudar una orden (finalizar pausa activa)
   * @param {number} codOrden - Código de la orden a reanudar
   * @param {string} descripcionFinal - Descripción final de la pausa (opcional)
   * @param {string} usuario - Usuario que reanuda la orden
   * @returns {Promise} Resultado de la operación
   */
  async resumeOrder(codOrden, descripcionFinal, usuario) {
    const url = `http://localhost:8020/pause/order/${codOrden}/finish-active`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descripcionFinal: descripcionFinal,
          updatedBy: usuario
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Orden reanudada (pausa finalizada):', result);
      return result;
    } catch (error) {
      console.error('Error al reanudar orden:', error);
      throw error;
    }
  }

  /**
   * Finalizar una orden de producción
   * @param {number} orderId - ID de la orden a finalizar
   * @param {number} botesBuenos - Cantidad de botes buenos producidos
   * @param {number} botesMalos - Cantidad de botes malos producidos
   * @param {boolean} acumula - Si la producción acumula
   * @returns {Promise} Resultado de la operación
   */
  async finalizeOrder(orderId, botesBuenos, botesMalos, acumula) {
    const url = `http://localhost:8020/order/${orderId}/finalize`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botesBuenos: botesBuenos,
          botesMalos: botesMalos,
          acumula: acumula
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      console.log('Orden finalizada:', result);
      return result;
    } catch (error) {
      console.error('Error al finalizar orden:', error);
      throw error;
    }
  }
}

export default new ApiService();