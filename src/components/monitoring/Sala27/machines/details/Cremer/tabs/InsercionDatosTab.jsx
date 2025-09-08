import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../../../ui/card';
import { Save, Search, AlertCircle, CheckCircle, Database, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const InsercionDatosTab = ({ cremerData }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(5);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [formData, setFormData] = useState({
    formato: '',
    tipo: '',
    udsBote: '',
    tipoBote: ''
  });

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.11.7:3002/api/ordenes-fabricacion');
      if (response.ok) {
        const data = await response.json();
        setOrdenes(data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar las órdenes de fabricación' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      formato: '',
      tipo: '',
      udsBote: '',
      tipoBote: ''
    });
    setSelectedOrden(null);
    setMensaje({ tipo: '', texto: '' });
  };

  const validarFormulario = () => {
    if (!selectedOrden) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar una orden de fabricación' });
      return false;
    }
    if (!formData.formato || !formData.tipo || !formData.udsBote || !formData.tipoBote) {
      setMensaje({ tipo: 'error', texto: 'Todos los campos son obligatorios' });
      return false;
    }
    if (isNaN(formData.udsBote) || parseInt(formData.udsBote) <= 0) {
      setMensaje({ tipo: 'error', texto: 'Las unidades por bote deben ser un número positivo' });
      return false;
    }
    return true;
  };

  const guardarDetalles = async () => {
    if (!validarFormulario()) return;

    setSaving(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const dataToSend = {
        formato: formData.formato,
        tipo: formData.tipo,
        udsBote: parseInt(formData.udsBote),
        tipoBote: formData.tipoBote
      };

      const response = await fetch(
        `http://192.168.11.7:3002/api/ordenes-fabricacion/${selectedOrden.id}/detalles-producto`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        }
      );

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: 'Detalles del producto guardados exitosamente' });
        limpiarFormulario();
        // Recargar órdenes para mostrar datos actualizados
        await cargarOrdenes();
      } else {
        const errorData = await response.json();
        setMensaje({ 
          tipo: 'error', 
          texto: errorData.message || 'Error al guardar los detalles del producto' 
        });
      }
    } catch (error) {
      console.error('Error al guardar detalles:', error);
      setMensaje({ tipo: 'error', texto: 'Error de conexión al guardar los detalles' });
    } finally {
      setSaving(false);
    }
  };

  // Filtrar órdenes
  const ordenesFiltradas = ordenes.filter(orden => {
    const coincideBusqueda = searchTerm === '' || 
      orden.codigoOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.producto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const coincideEstado = filtroEstado === '' || orden.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  // Paginación
  const totalPaginas = Math.ceil(ordenesFiltradas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const ordenesPaginadas = ordenesFiltradas.slice(indiceInicio, indiceFin);

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filtroEstado]);

  const seleccionarOrden = (orden) => {
    setSelectedOrden(orden);
    setMensaje({ tipo: '', texto: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Inserción de Datos de Producto</h2>
      </div>

      {/* Mensaje de estado */}
      {mensaje.texto && (
        <Card className={`border ${
          mensaje.tipo === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {mensaje.tipo === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                mensaje.tipo === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {mensaje.texto}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de órdenes */}
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Seleccionar Orden de Fabricación
            </h3>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por código o producto..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="iniciada">Iniciada</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completada">Completada</option>
                  <option value="pausada">Pausada</option>
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Código</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Producto</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        Cargando órdenes...
                      </td>
                    </tr>
                  ) : ordenesPaginadas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No se encontraron órdenes
                      </td>
                    </tr>
                  ) : (
                    ordenesPaginadas.map((orden) => (
                      <tr 
                        key={orden.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          selectedOrden?.id === orden.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-medium">{orden.codigoOrden}</td>
                        <td className="py-2 px-3">{orden.producto}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            orden.estado === 'completada' ? 'bg-green-100 text-green-800' :
                            orden.estado === 'iniciada' ? 'bg-blue-100 text-blue-800' :
                            orden.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                            orden.estado === 'pausada' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {orden.estado}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => seleccionarOrden(orden)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              selectedOrden?.id === orden.id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {selectedOrden?.id === orden.id ? 'Seleccionada' : 'Seleccionar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Mostrando {indiceInicio + 1} a {Math.min(indiceFin, ordenesFiltradas.length)} de {ordenesFiltradas.length} órdenes
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                    className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Página {paginaActual} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="p-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulario de inserción */}
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Save className="w-5 h-5 mr-2 text-green-600" />
              Detalles del Producto
            </h3>

            {selectedOrden ? (
              <div className="space-y-4">
                {/* Información de la orden seleccionada */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Orden Seleccionada:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Código:</span>
                      <span className="ml-2 text-blue-900">{selectedOrden.codigoOrden}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Producto:</span>
                      <span className="ml-2 text-blue-900">{selectedOrden.producto}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Estado:</span>
                      <span className="ml-2 text-blue-900">{selectedOrden.estado}</span>
                    </div>
                  </div>
                </div>

                {/* Formato */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato *
                  </label>
                  <input
                    type="text"
                    name="formato"
                    value={formData.formato}
                    onChange={handleInputChange}
                    placeholder="Ej: 750ml"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    placeholder="Ej: Mermelada Artesanal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Unidades por bote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidades por Bote *
                  </label>
                  <input
                    type="number"
                    name="udsBote"
                    value={formData.udsBote}
                    onChange={handleInputChange}
                    placeholder="Ej: 12"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tipo de bote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Bote *
                  </label>
                  <input
                    type="text"
                    name="tipoBote"
                    value={formData.tipoBote}
                    onChange={handleInputChange}
                    placeholder="Ej: Vidrio Ámbar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Botones */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={guardarDetalles}
                    disabled={saving || loading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar Detalles'}</span>
                  </button>
                  <button
                    onClick={limpiarFormulario}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Seleccione una orden de la tabla para insertar los detalles del producto</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

    
    </div>
  );
};

export default InsercionDatosTab;