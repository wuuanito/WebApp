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
        const response = await fetch('http://192.168.11.7:3005/api/ordenes-fabricacion');
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
      const response = await fetch(`http://192.168.11.7:3005/api/ordenes-fabricacion/${orden.id}`);
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
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Fechas y Tiempos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hora Inicio</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.horaInicio)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hora Fin</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.horaFin)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Estimado Producción</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoEstimadoProduccion?.toFixed(2) || 'N/A'} min</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total Activo</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotalActivo?.toFixed(2) || 'N/A'} min</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total Pausas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotalPausas?.toFixed(2) || 'N/A'} min</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tiempo Total</label>
                          <p className="text-sm text-gray-900">{selectedOrden.tiempoTotal?.toFixed(2) || 'N/A'} min</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedOrden.ultimaActualizacion)}</p>
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
                          <p className="text-sm text-gray-900">{selectedOrden.numeroCajas || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes por Caja</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesPorCaja || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Cajas Contadas</label>
                          <p className="text-sm text-gray-900">{selectedOrden.cajasContadas || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Buenos</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesBuenos || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Malos</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesMalos || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Botes Totales</label>
                          <p className="text-sm text-gray-900">{selectedOrden.botesTotales || 'N/A'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'pausas' && (
                <div className="space-y-4">
                  {loadingPausas ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Cargando pausas...</span>
                    </div>
                  ) : pausas.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No hay pausas registradas para esta orden
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pausas.map((pausa, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Fecha Inicio</label>
                                <p className="text-sm text-gray-900">{formatDate(pausa.horaInicio)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Fecha Fin</label>
                                <p className="text-sm text-gray-900">{formatDate(pausa.horaFin)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Duración</label>
                                <p className="text-sm text-gray-900">{calcularDuracionPausa(pausa.horaInicio, pausa.horaFin)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Tipo de Pausa</label>
                                <p className="text-sm text-gray-900">{pausa.tipoPausa || 'N/A'}</p>
                              </div>
                              {pausa.comentario && (
                                <div className="md:col-span-2 lg:col-span-4">
                                  <label className="text-sm font-medium text-gray-500">Comentario</label>
                                  <p className="text-sm text-gray-900">{pausa.comentario}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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