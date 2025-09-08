import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../ui/card';

const OrdenesFabricacionTab = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pausas, setPausas] = useState([]);
  const [loadingPausas, setLoadingPausas] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [filters, setFilters] = useState({
    estado: '',
    codigoOrden: '',
    producto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Fetch órdenes de fabricación
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.11.7:3002/api/ordenes-fabricacion');
        if (!response.ok) {
          throw new Error('Error al cargar las órdenes de fabricación');
        }
        const data = await response.json();
        setOrdenes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  // Filtrar órdenes
  const filteredOrdenes = ordenes.filter(orden => {
    return (
      (filters.estado === '' || orden.estado.toLowerCase().includes(filters.estado.toLowerCase())) &&
      (filters.codigoOrden === '' || orden.codigoOrden.toLowerCase().includes(filters.codigoOrden.toLowerCase())) &&
      (filters.producto === '' || orden.producto.toLowerCase().includes(filters.producto.toLowerCase())) &&
      (filters.fechaInicio === '' || new Date(orden.horaInicio) >= new Date(filters.fechaInicio)) &&
      (filters.fechaFin === '' || new Date(orden.horaInicio) <= new Date(filters.fechaFin))
    );
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrdenes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrdenes.length / itemsPerPage);

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset a primera página cuando se filtra
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      estado: '',
      codigoOrden: '',
      producto: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setCurrentPage(1);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'iniciada':
        return 'text-blue-600 bg-blue-100';
      case 'finalizada':
        return 'text-green-600 bg-green-100';
      case 'pausada':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelada':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Abrir modal con detalles de la orden
  const handleOpenModal = async (orden) => {
    setIsModalOpen(true);
    
    // Cargar detalles completos de la orden incluyendo pausas
    try {
      setLoadingPausas(true);
      const response = await fetch(`http://192.168.11.7:3002/api/ordenes-fabricacion/${orden.id}`);
      if (response.ok) {
        const ordenCompleta = await response.json();
        setSelectedOrden(ordenCompleta);
        setPausas(ordenCompleta.pausas || []);
      } else {
        setSelectedOrden(orden);
        setPausas([]);
      }
    } catch (err) {
      console.error('Error al cargar detalles de la orden:', err);
      setSelectedOrden(orden);
      setPausas([]);
    } finally {
      setLoadingPausas(false);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrden(null);
    setPausas([]);
  };

  // Calcular duración de pausa
  const calcularDuracionPausa = (inicio, fin) => {
    if (!inicio || !fin) return 'En curso';
    const diff = new Date(fin) - new Date(inicio);
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando órdenes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Filtros Avanzados</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="iniciada">Iniciada</option>
                <option value="finalizada">Finalizada</option>
                <option value="pausada">Pausada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Orden</label>
              <input
                type="text"
                value={filters.codigoOrden}
                onChange={(e) => handleFilterChange('codigoOrden', e.target.value)}
                placeholder="Buscar por código..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <input
                type="text"
                value={filters.producto}
                onChange={(e) => handleFilterChange('producto', e.target.value)}
                placeholder="Buscar por producto..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio (desde)</label>
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio (hasta)</label>
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Órdenes */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Órdenes de Fabricación ({filteredOrdenes.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((orden) => (
                  <tr 
                    key={orden.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOpenModal(orden)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {orden.codigoOrden}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={orden.producto}>
                      {orden.producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(orden.estado)}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {orden.cantidadProducir?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(orden.horaInicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(orden.horaFin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {orden.porcentajeCompletado ? `${orden.porcentajeCompletado.toFixed(1)}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredOrdenes.length)}</span> de{' '}
                      <span className="font-medium">{filteredOrdenes.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ‹
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles de Orden */}
      {isModalOpen && selectedOrden && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles de Orden: {selectedOrden.codigoOrden}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Información General
                </button>
                <button
                  onClick={() => setActiveTab('pausas')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pausas'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pausas ({pausas.length})
                </button>
              </nav>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Información General */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Información General</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">ID</label>
                          <p className="text-sm text-gray-900">{selectedOrden.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Código de Orden</label>
                          <p className="text-sm text-gray-900">{selectedOrden.codigoOrden}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Código Artículo</label>
                          <p className="text-sm text-gray-900">{selectedOrden.codigoArticulo || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Producto</label>
                          <p className="text-sm text-gray-900">{selectedOrden.producto}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Formato</label>
                          <p className="text-sm text-gray-900">{selectedOrden.formato || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tipo || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Uds Bote</label>
                          <p className="text-sm text-gray-900">{selectedOrden.udsBote || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo de Bote</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tipoBote || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Estado</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(selectedOrden.estado)}`}>
                            {selectedOrden.estado}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fechas y Tiempos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hora de Inicio</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.horaInicio)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hora de Fin</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.horaFin)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Estimado Producción</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoEstimadoProduccion ? `${selectedOrden.tiempoEstimadoProduccion.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total Activo</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotalActivo ? `${selectedOrden.tiempoTotalActivo.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total Pausas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotalPausas ? `${selectedOrden.tiempoTotalPausas.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotal ? `${selectedOrden.tiempoTotal.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hora Pausa Fin Máquina</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.horaPausaFinMaquina)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total hasta Pausa Fin</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotalHastaPausaFinMaquina ? `${selectedOrden.tiempoTotalHastaPausaFinMaquina.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Activo hasta Pausa Fin</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoActivoHastaPausaFinMaquina ? `${selectedOrden.tiempoActivoHastaPausaFinMaquina.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Pausas hasta Pausa Fin</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoPausasHastaPausaFinMaquina ? `${selectedOrden.tiempoPausasHastaPausaFinMaquina.toFixed(2)} min` : 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cantidades y Producción</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Cantidad a Producir</label>
                          <p className="text-sm text-gray-900">{selectedOrden.cantidadProducir?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Número de Cajas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.numeroCajas?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes por Caja</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesPorCaja?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Cajas Contadas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.cajasContadas?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Buenos</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesBuenos?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Repercap</label>
                          <p className="text-sm text-gray-900">{selectedOrden.repercap ? 'Sí' : 'No'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Corte Sanitario Inicial</label>
                          <p className="text-sm text-gray-900">{selectedOrden.numeroCorteSanitarioInicial || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Corte Sanitario Final</label>
                          <p className="text-sm text-gray-900">{selectedOrden.numeroCorteSanitarioFinal || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Métricas de Calidad y Unidades */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Unidades y Calidad</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Unidades Cierre Fin</label>
                          <p className="text-sm text-gray-900">{selectedOrden.unidadesCierreFin?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Unidades No OK Fin</label>
                          <p className="text-sm text-gray-900">{selectedOrden.unidadesNoOkFin?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Total Unidades</label>
                          <p className="text-sm text-gray-900">{selectedOrden.totalUnidades?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Ponderal</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesPonderal?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Expulsados</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesExpulsados?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Recirculación Repercap</label>
                          <p className="text-sm text-gray-900">{selectedOrden.recirculacionRepercap || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Recirculación Ponderal</label>
                          <p className="text-sm text-gray-900">{selectedOrden.recirculacionPonderal || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Porcentajes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">% Unidades OK</label>
                          <p className="text-sm text-gray-900">{selectedOrden.porcentajeUnidadesOk ? `${selectedOrden.porcentajeUnidadesOk.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">% Unidades No OK</label>
                          <p className="text-sm text-gray-900">{selectedOrden.porcentajeUnidadesNoOk ? `${selectedOrden.porcentajeUnidadesNoOk.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">% Pausas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.porcentajePausas ? `${selectedOrden.porcentajePausas.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">% Completado</label>
                          <p className="text-sm text-gray-900">{selectedOrden.porcentajeCompletado ? `${selectedOrden.porcentajeCompletado.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tasa Expulsión</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tasaExpulsion ? `${selectedOrden.tasaExpulsion.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tasa Recuperación Ponderal</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tasaRecuperacionPonderal ? `${selectedOrden.tasaRecuperacionPonderal.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tasa Recuperación Repercap</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tasaRecuperacionRepercap ? `${selectedOrden.tasaRecuperacionRepercap.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Indicadores OEE</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Standard Real</label>
                          <p className="text-sm text-gray-900">{selectedOrden.standardReal ? `${selectedOrden.standardReal.toFixed(2)}` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Standard Real vs Teórico</label>
                          <p className="text-sm text-gray-900">{selectedOrden.standardRealVsTeorico ? `${selectedOrden.standardRealVsTeorico.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Disponibilidad</label>
                          <p className="text-sm text-gray-900">{selectedOrden.disponibilidad ? `${selectedOrden.disponibilidad.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Rendimiento</label>
                          <p className="text-sm text-gray-900">{selectedOrden.rendimiento ? `${selectedOrden.rendimiento.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Calidad</label>
                          <p className="text-sm text-gray-900">{selectedOrden.calidad ? `${selectedOrden.calidad.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">OEE</label>
                          <p className="text-sm text-gray-900">{selectedOrden.oee ? `${selectedOrden.oee.toFixed(2)}%` : 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fechas de Sistema */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fechas de Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.createdAt)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.updatedAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'pausas' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Historial de Pausas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingPausas ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Cargando pausas...</span>
                        </div>
                      ) : pausas.length > 0 ? (
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm">
                             <thead className="bg-gray-50">
                               <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Pausa</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comentario</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Computa</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200">
                               {pausas.map((pausa, index) => (
                                 <tr key={pausa.id || index} className="hover:bg-gray-50">
                                   <td className="px-4 py-2 text-gray-900">{pausa.tipoPausa || 'N/A'}</td>
                                   <td className="px-4 py-2 text-gray-900">{formatDate(pausa.horaInicio)}</td>
                                   <td className="px-4 py-2 text-gray-900">{formatDate(pausa.horaFin)}</td>
                                   <td className="px-4 py-2 text-gray-900">{calcularDuracionPausa(pausa.horaInicio, pausa.horaFin)}</td>
                                   <td className="px-4 py-2 text-gray-900 max-w-xs truncate" title={pausa.comentario}>
                                     {pausa.comentario || 'N/A'}
                                   </td>
                                   <td className="px-4 py-2 text-gray-900">
                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                       pausa.computaEnTiempo ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                                     }`}>
                                       {pausa.computaEnTiempo ? 'Sí' : 'No'}
                                     </span>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No se encontraron pausas para esta orden</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesFabricacionTab;