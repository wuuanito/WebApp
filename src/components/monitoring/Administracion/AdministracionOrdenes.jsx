import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Clock, User, Package, BarChart3, Pause, Play, Eye, X, Plus } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import wsClient from '../../../services/websocket';
import apiService from '../../../services/api';

const API_BASE_URL = 'http://localhost:8020';

const AdministracionOrdenes = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedOrderForPause, setSelectedOrderForPause] = useState(null);
  const [selectedOrderForResume, setSelectedOrderForResume] = useState(null);
  const [selectedOrderForFinalize, setSelectedOrderForFinalize] = useState(null);
  const [pauseData, setPauseData] = useState({
    tipo: '',
    descripcion: '',
    usuario: ''
  });
  const [resumeData, setResumeData] = useState({
    descripcionFinal: '',
    usuario: ''
  });
  const [finalizeData, setFinalizeData] = useState({
    botesBuenos: '',
    botesMalos: '',
    acumula: true
  });
  const [newOrder, setNewOrder] = useState({
    codOrden: '',
    usuario: '',
    lote: '',
    articulo: '',
    descripcion: '',
    cantidad: '',
    botesCaja: '',
    repercap: false,
    idMachine: ''
  });

  useEffect(() => {
    fetchOrders();
    
    // Configurar WebSocket para actualizaciones en tiempo real
    wsClient.connect();
    
    // Escuchar eventos de órdenes en tiempo real
    // Los eventos soportados son:
    // - ORDER_STARTED: Cuando una orden es iniciada
    // - ORDER_FINALIZED: Cuando una orden es finalizada
    // - PAUSE_STARTED: Cuando se inicia una pausa
    // - PAUSE_FINISHED: Cuando se finaliza una pausa
    
    // Configurar callback para actualizaciones de órdenes
    wsClient.onOrderUpdate((notification) => {
      console.log('Actualización de orden recibida:', notification);
      
      switch(notification.type) {
        case 'NEW_ORDER':
        case 'STATUS_UPDATE':
        case 'ORDER_UPDATE':
        case 'PAUSE_UPDATE':
          // Recargar la lista de órdenes cuando hay cambios
          fetchOrders();
          break;
        default:
          console.log('Tipo de notificación no manejado:', notification.type);
      }
      
      // Manejar acciones específicas
      if (notification.action) {
        switch(notification.action) {
          case 'ORDER_STARTED':
            toast.success(`Orden ${notification.data?.codOrden || 'N/A'} iniciada correctamente`);
            break;
          case 'ORDER_FINALIZED':
            toast.success(`Orden ${notification.data?.codOrden || 'N/A'} finalizada`);
            break;
          case 'PAUSE_STARTED':
            toast.info(`Pausa iniciada en orden ${notification.data?.codOrden || 'N/A'}`);
            break;
          case 'PAUSE_FINISHED':
            toast.info(`Pausa finalizada en orden ${notification.data?.codOrden || 'N/A'}`);
            break;
        }
      }
    });
    
    // Configurar callback para métricas OEE
    wsClient.onOeeUpdate((oeeData) => {
      console.log('Métricas OEE actualizadas:', oeeData);
      // Si hay una orden seleccionada, actualizar sus métricas
      if (selectedOrder && oeeData.orderId === selectedOrder.idOrder) {
        setSelectedOrder(prev => ({
          ...prev,
          oee: oeeData
        }));
      }
    });
    
    // Configurar callback para notificaciones del sistema
    wsClient.onSystemNotification((systemMsg) => {
      console.log('Notificación del sistema:', systemMsg);
    });
    
    // Cleanup al desmontar el componente
    return () => {
      wsClient.disconnect();
    };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/order`);
      if (!response.ok) {
        throw new Error('Error al cargar las órdenes');
      }
      const data = await response.json();
      console.log('Datos de órdenes recibidos:', data);
      // Verificar estructura de cada orden
      if (data.length > 0) {
        console.log('Estructura de primera orden:', data[0]);
        console.log('Campos disponibles:', Object.keys(data[0]));
      }
      setOrders(data);
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      setOrderDetailLoading(true);
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`);
      if (!response.ok) {
        throw new Error('Error al cargar el detalle de la orden');
      }
      const data = await response.json();
      setSelectedOrder(data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      toast.error('Error al cargar el detalle de la orden');
      setError(err.message);
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCreateOrder = async () => {
    setCreateLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codOrden: parseInt(newOrder.codOrden),
          usuario: newOrder.usuario,
          lote: newOrder.lote,
          articulo: newOrder.articulo,
          descripcion: newOrder.descripcion,
          cantidad: parseInt(newOrder.cantidad),
          botesCaja: parseInt(newOrder.botesCaja),
          repercap: newOrder.repercap,
          idMachine: parseInt(newOrder.idMachine)
        })
      });
      
      if (response.ok) {
        const createdOrder = await response.json();
        console.log('Orden creada:', createdOrder);
        
        // Mostrar notificación de éxito
        toast.success(`Orden ${newOrder.codOrden} creada exitosamente`);
        
        // Cerrar modal y limpiar formulario
        setShowCreateModal(false);
        setNewOrder({
          codOrden: '',
          usuario: '',
          lote: '',
          articulo: '',
          descripcion: '',
          cantidad: '',
          botesCaja: '',
          repercap: false,
          idMachine: ''
        });
        
        // La lista se actualizará automáticamente via WebSocket
        // pero refrescamos por si acaso
        fetchOrders();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Error al crear la orden';
        toast.error(errorMessage);
        console.error('Error al crear la orden:', errorData);
      }
    } catch (error) {
      toast.error('Error de conexión al crear la orden');
      console.error('Error creando orden:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para iniciar una orden
  const handleStartOrder = async (orderId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`start_${orderId}`]: true }));
      
      await apiService.startOrder(orderId);
      
      toast.success('Orden iniciada correctamente');
      
      // Recargar órdenes para reflejar el cambio de estado
      fetchOrders();
    } catch (error) {
      console.error('Error al iniciar orden:', error);
      toast.error(error.message || 'Error al iniciar la orden');
    } finally {
      setActionLoading(prev => ({ ...prev, [`start_${orderId}`]: false }));
    }
  };

  // Función para abrir modal de pausa
  const handleOpenPauseModal = (order) => {
    setSelectedOrderForPause(order);
    setPauseData({
      tipo: '',
      descripcion: '',
      usuario: ''
    });
    setShowPauseModal(true);
  };

  // Función para pausar una orden
  const handlePauseOrder = async () => {
    if (!selectedOrderForPause || !pauseData.tipo || !pauseData.descripcion || !pauseData.usuario) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`pause_${selectedOrderForPause.idOrder}`]: true }));
      
      await apiService.pauseOrder(
        selectedOrderForPause.codOrden,
        pauseData.tipo,
        pauseData.descripcion,
        pauseData.usuario
      );
      
      toast.success('Orden pausada correctamente');
      
      // Cerrar modal y recargar órdenes
      setShowPauseModal(false);
      setSelectedOrderForPause(null);
      fetchOrders();
    } catch (error) {
      console.error('Error al pausar orden:', error);
      toast.error(error.message || 'Error al pausar la orden');
    } finally {
      setActionLoading(prev => ({ ...prev, [`pause_${selectedOrderForPause?.idOrder}`]: false }));
    }
  };

  // Función para manejar cambios en el formulario de pausa
  const handlePauseInputChange = (field, value) => {
    setPauseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para abrir modal de reanudar orden
  const handleOpenResumeModal = (order) => {
    setSelectedOrderForResume(order);
    setResumeData({
      descripcionFinal: '',
      usuario: ''
    });
    setShowResumeModal(true);
  };

  // Función para reanudar orden
  const handleResumeOrder = async () => {
    if (!selectedOrderForResume || !resumeData.usuario.trim()) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    setActionLoading(prev => ({ ...prev, [selectedOrderForResume.idOrder]: true }));
    try {
      await apiService.resumeOrder(
        selectedOrderForResume.codOrden,
        resumeData.descripcionFinal,
        resumeData.usuario
      );
      
      toast.success('Orden reanudada exitosamente');
      setShowResumeModal(false);
      setSelectedOrderForResume(null);
      await fetchOrders();
    } catch (error) {
      console.error('Error al reanudar orden:', error);
      toast.error('Error al reanudar la orden: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedOrderForResume?.idOrder]: false }));
    }
  };

  // Función para manejar cambios en inputs de reanudar
  const handleResumeInputChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para abrir modal de finalizar orden
  const handleOpenFinalizeModal = (order) => {
    setSelectedOrderForFinalize(order);
    setFinalizeData({
      botesBuenos: '',
      botesMalos: '',
      acumula: true
    });
    setShowFinalizeModal(true);
  };

  // Función para finalizar orden
  const handleFinalizeOrder = async () => {
    if (!selectedOrderForFinalize || !finalizeData.botesBuenos || !finalizeData.botesMalos) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    setActionLoading(prev => ({ ...prev, [selectedOrderForFinalize.idOrder]: true }));
    try {
      await apiService.finalizeOrder(
        selectedOrderForFinalize.idOrder,
        parseInt(finalizeData.botesBuenos),
        parseInt(finalizeData.botesMalos),
        finalizeData.acumula
      );
      
      toast.success('Orden finalizada exitosamente');
      setShowFinalizeModal(false);
      setSelectedOrderForFinalize(null);
      await fetchOrders();
    } catch (error) {
      console.error('Error al finalizar orden:', error);
      toast.error('Error al finalizar la orden: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedOrderForFinalize?.idOrder]: false }));
    }
  };

  // Función para manejar cambios en inputs de finalizar
  const handleFinalizeInputChange = (field, value) => {
    setFinalizeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredOrders = orders.filter(order =>
    order.codOrden.toString().includes(searchTerm) ||
    order.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.articulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getEstadoBadge = (estado) => {
    const badges = {
      'finalizada': 'bg-green-100 text-green-800',
      'en_proceso': 'bg-blue-100 text-blue-800',
      'pausada': 'bg-yellow-100 text-yellow-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const calculateDuration = (inicio, fin) => {
    if (!inicio || !fin) return 'N/A';
    const start = new Date(inicio);
    const end = new Date(fin);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Órdenes</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Orden
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="h-4 w-4" />
            Vista General
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar por código, lote, artículo, usuario o máquina..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Orden
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Máquina
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lote
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artículo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producción
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OEE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pausas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron órdenes que coincidan con la búsqueda' : 'No hay órdenes registradas'}
                    </td>
                  </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.idOrder} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.codOrden}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(order.estado)}`}>
                        {order.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {order.machineName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        {order.usuario}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {order.lote}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.articulo}</div>
                        {order.descripcion && (
                          <div className="text-xs text-gray-500">{order.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-1" />
                        {order.cantidad.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {order.botesBuenos !== null && order.botesMalos !== null ? (
                        <div>
                          <div className="text-green-600 font-medium">
                            ✓ {order.botesBuenos?.toLocaleString() || 0}
                          </div>
                          <div className="text-red-600 text-xs">
                            ✗ {order.botesMalos?.toLocaleString() || 0}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">En proceso</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {order.oee ? (
                        <div>
                          <div className="font-medium text-blue-600">
                            {order.oee.oee.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            D: {(order.oee.disponibilidad / 100).toFixed(2)} |
                            R: {order.oee.rendimiento.toFixed(2)} |
                            C: {(order.oee.calidad / 100).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {calculateDuration(order.horaInicio, order.horaFin)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {order.pausas && order.pausas.length > 0 ? (
                        <div className="flex items-center">
                          <Pause className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-yellow-600 font-medium">{order.pausas.length}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Play className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600">0</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {/* Botón Ver Detalle */}
                        <button
                          onClick={() => fetchOrderDetail(order.idOrder)}
                          disabled={orderDetailLoading}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </button>
                        
                        {/* Botón Iniciar Orden - Solo si está creada */}
                        {order.estado === 'creada' && (
                          <button
                            onClick={() => handleStartOrder(order.idOrder)}
                            disabled={actionLoading[`start_${order.idOrder}`]}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {actionLoading[`start_${order.idOrder}`] ? 'Iniciando...' : 'Iniciar'}
                          </button>
                        )}
                        
                        {/* Botón Pausar Orden - Solo si está en proceso */}
                        {order.estado === 'en_proceso' && (
                          <button
                            onClick={() => handleOpenPauseModal(order)}
                            disabled={actionLoading[order.idOrder]}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            {actionLoading[order.idOrder] ? 'Pausando...' : 'Pausar'}
                          </button>
                        )}
                        
                        {/* Botón Reanudar Orden - Solo si está pausada */}
                        {order.estado === 'pausada' && (
                          <button
                            onClick={() => handleOpenResumeModal(order)}
                            disabled={actionLoading[order.idOrder]}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {actionLoading[order.idOrder] ? 'Reanudando...' : 'Reanudar'}
                          </button>
                        )}
                        
                        {/* Botón Finalizar Orden - Solo si está en proceso */}
                        {order.estado === 'en_proceso' && (
                          <button
                            onClick={() => handleOpenFinalizeModal(order)}
                            disabled={actionLoading[order.idOrder]}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {actionLoading[order.idOrder] ? 'Finalizando...' : 'Finalizar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <div className="text-sm text-blue-600">Total Órdenes</div>
              <div className="text-lg font-bold text-blue-800">{orders.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <div className="text-sm text-green-600">Finalizadas</div>
              <div className="text-lg font-bold text-green-800">
                {orders.filter(o => o.estado === 'finalizada').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <div className="text-sm text-yellow-600">En Proceso</div>
              <div className="text-lg font-bold text-yellow-800">
                {orders.filter(o => o.estado === 'en_proceso').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-purple-400 mr-2" />
            <div>
              <div className="text-sm text-purple-600">OEE Promedio</div>
              <div className="text-lg font-bold text-purple-800">
                {orders.filter(o => o.oee).length > 0 
                  ? (orders.filter(o => o.oee).reduce((acc, o) => acc + o.oee.oee, 0) / orders.filter(o => o.oee).length).toFixed(1)
                  : '0'
                }%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-700">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
            {searchTerm && ` (filtrado por: "${searchTerm}")`}
          </span>
        </div>
      </div>

      {/* Modal de Detalle de Orden */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detalle de Orden</h2>
                <p className="text-sm text-gray-600">Código: {selectedOrder.codOrden}</p>
              </div>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Información General</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Orden:</span>
                      <span className="font-medium">{selectedOrder.idOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(selectedOrder.estado)}`}>
                        {selectedOrder.estado.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Máquina:</span>
                      <span className="font-medium">{selectedOrder.machineName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usuario:</span>
                      <span className="font-medium">{selectedOrder.usuario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lote:</span>
                      <span className="font-medium">{selectedOrder.lote}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Producto</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Artículo:</span>
                      <span className="font-medium">{selectedOrder.articulo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Descripción:</span>
                      <span className="font-medium text-right max-w-48 truncate">{selectedOrder.descripcion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad:</span>
                      <span className="font-medium">{selectedOrder.cantidad?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Botes/Caja:</span>
                      <span className="font-medium">{selectedOrder.botesCaja}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repercap:</span>
                      <span className={`font-medium ${selectedOrder.repercap ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOrder.repercap ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acumula:</span>
                      <span className={`font-medium ${selectedOrder.acumula ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOrder.acumula ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiempos */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiempos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600 block">Hora Inicio:</span>
                    <span className="font-medium">{formatDate(selectedOrder.horaInicio)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Hora Fin:</span>
                    <span className="font-medium">{formatDate(selectedOrder.horaFin)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Duración:</span>
                    <span className="font-medium">{calculateDuration(selectedOrder.horaInicio, selectedOrder.horaFin)}</span>
                  </div>
                </div>
              </div>

              {/* Producción */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Producción</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-600 block">Botes Buenos:</span>
                    <span className="font-medium text-green-600">{selectedOrder.botesBuenos?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Botes Malos:</span>
                    <span className="font-medium text-red-600">{selectedOrder.botesMalos?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Total Producido:</span>
                    <span className="font-medium">{((selectedOrder.botesBuenos || 0) + (selectedOrder.botesMalos || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Métricas OEE */}
              {selectedOrder.oee && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Métricas OEE</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="text-center">
                       <div className="text-2xl font-bold text-purple-600">{selectedOrder.oee.oee.toFixed(2)}</div>
                       <div className="text-sm text-gray-600">OEE Total</div>
                     </div>
                     <div className="text-center">
                       <div className="text-xl font-bold text-blue-600">{(selectedOrder.oee.disponibilidad / 100).toFixed(2)}</div>
                       <div className="text-sm text-gray-600">Disponibilidad</div>
                     </div>
                     <div className="text-center">
                       <div className="text-xl font-bold text-green-600">{selectedOrder.oee.rendimiento.toFixed(2)}</div>
                       <div className="text-sm text-gray-600">Rendimiento</div>
                     </div>
                     <div className="text-center">
                       <div className="text-xl font-bold text-orange-600">{(selectedOrder.oee.calidad / 100).toFixed(2)}</div>
                       <div className="text-sm text-gray-600">Calidad</div>
                     </div>
                   </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Tiempo Total:</span>
                      <span className="font-medium">{Math.floor(selectedOrder.oee.tiempoTotal / 60).toString().padStart(2, '0')}:{Math.floor(selectedOrder.oee.tiempoTotal % 60).toString().padStart(2, '0')}:00</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Tiempo Activo:</span>
                      <span className="font-medium">{Math.floor(selectedOrder.oee.tiempoActivo / 60).toString().padStart(2, '0')}:{Math.floor(selectedOrder.oee.tiempoActivo % 60).toString().padStart(2, '0')}:00</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Tiempo Pausado:</span>
                      <span className="font-medium">{Math.floor(selectedOrder.oee.tiempoPausado / 60).toString().padStart(2, '0')}:{Math.floor(selectedOrder.oee.tiempoPausado % 60).toString().padStart(2, '0')}:00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pausas */}
              {selectedOrder.pausas && selectedOrder.pausas.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pausas ({selectedOrder.pausas.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.pausas.map((pausa, index) => (
                      <div key={pausa.idPause} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">Pausa #{index + 1}</span>
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                {pausa.tipo}
                              </span>
                              {pausa.computa && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                  Computa
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{pausa.descripcion}</p>
                            <div className="text-xs text-gray-500">
                              {formatDate(pausa.horaInicio)} - {formatDate(pausa.horaFin)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {calculateDuration(pausa.horaInicio, pausa.horaFin)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fechas de Creación y Actualización */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Creado:</span>
                    <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Actualizado:</span>
                    <span className="font-medium">{formatDate(selectedOrder.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Orden */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Crear Nueva Orden</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Orden *
                </label>
                <input
                  type="number"
                  value={newOrder.codOrden}
                  onChange={(e) => handleInputChange('codOrden', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={newOrder.usuario}
                  onChange={(e) => handleInputChange('usuario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="operador1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lote *
                </label>
                <input
                  type="text"
                  value={newOrder.lote}
                  onChange={(e) => handleInputChange('lote', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="LOTE-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artículo *
                </label>
                <input
                  type="text"
                  value={newOrder.articulo}
                  onChange={(e) => handleInputChange('articulo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ART-001"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={newOrder.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción de la orden"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  value={newOrder.cantidad}
                  onChange={(e) => handleInputChange('cantidad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botes por Caja *
                </label>
                <input
                  type="number"
                  value={newOrder.botesCaja}
                  onChange={(e) => handleInputChange('botesCaja', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Máquina *
                </label>
                <input
                  type="number"
                  value={newOrder.idMachine}
                  onChange={(e) => handleInputChange('idMachine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="repercap"
                  checked={newOrder.repercap}
                  onChange={(e) => handleInputChange('repercap', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="repercap" className="text-sm font-medium text-gray-700">
                  Repercute en capacidad
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={createLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={createLoading || !newOrder.codOrden || !newOrder.usuario || !newOrder.lote || !newOrder.articulo || !newOrder.descripcion || !newOrder.cantidad || !newOrder.botesCaja || !newOrder.idMachine}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createLoading ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pausar Orden */}
      {showPauseModal && selectedOrderForPause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Pausar Orden</h3>
              <button
                onClick={() => setShowPauseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Orden: <span className="font-medium">{selectedOrderForPause.codOrden}</span>
              </p>
              <p className="text-sm text-gray-600">
                Artículo: <span className="font-medium">{selectedOrderForPause.articulo}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Pausa *
                </label>
                <select
                  value={pauseData.tipo}
                  onChange={(e) => handlePauseInputChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="cambio_formato">Cambio de Formato</option>
                  <option value="falta_material">Falta de Material</option>
                  <option value="averia">Avería</option>
                  <option value="descanso">Descanso</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={pauseData.descripcion}
                  onChange={(e) => handlePauseInputChange('descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el motivo de la pausa..."
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={pauseData.usuario}
                  onChange={(e) => handlePauseInputChange('usuario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del usuario"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={actionLoading[`pause_${selectedOrderForPause.idOrder}`]}
              >
                Cancelar
              </button>
              <button
                onClick={handlePauseOrder}
                disabled={actionLoading[`pause_${selectedOrderForPause.idOrder}`] || !pauseData.tipo || !pauseData.descripcion || !pauseData.usuario}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading[`pause_${selectedOrderForPause.idOrder}`] ? 'Pausando...' : 'Pausar Orden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reanudar Orden */}
      {showResumeModal && selectedOrderForResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Reanudar Orden</h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Orden: <span className="font-medium">{selectedOrderForResume.codOrden}</span>
              </p>
              <p className="text-sm text-gray-600">
                Artículo: <span className="font-medium">{selectedOrderForResume.articulo}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción Final
                </label>
                <textarea
                  value={resumeData.descripcionFinal}
                  onChange={(e) => handleResumeInputChange('descripcionFinal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción final de la pausa (opcional)..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={resumeData.usuario}
                  onChange={(e) => handleResumeInputChange('usuario', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del usuario"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={actionLoading[selectedOrderForResume.id]}
              >
                Cancelar
              </button>
              <button
                onClick={handleResumeOrder}
                disabled={actionLoading[selectedOrderForResume.id] || !resumeData.usuario}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading[selectedOrderForResume.id] ? 'Reanudando...' : 'Reanudar Orden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Finalizar Orden */}
      {showFinalizeModal && selectedOrderForFinalize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Finalizar Orden</h3>
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Orden: <span className="font-medium">{selectedOrderForFinalize.codOrden}</span>
              </p>
              <p className="text-sm text-gray-600">
                Artículo: <span className="font-medium">{selectedOrderForFinalize.articulo}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botes Buenos *
                </label>
                <input
                  type="number"
                  value={finalizeData.botesBuenos}
                  onChange={(e) => handleFinalizeInputChange('botesBuenos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cantidad de botes buenos"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botes Malos *
                </label>
                <input
                  type="number"
                  value={finalizeData.botesMalos}
                  onChange={(e) => handleFinalizeInputChange('botesMalos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cantidad de botes malos"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={finalizeData.acumula}
                    onChange={(e) => handleFinalizeInputChange('acumula', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Acumular producción</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowFinalizeModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={actionLoading[selectedOrderForFinalize.id]}
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalizeOrder}
                disabled={actionLoading[selectedOrderForFinalize.id] || !finalizeData.botesBuenos || !finalizeData.botesMalos}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading[selectedOrderForFinalize.id] ? 'Finalizando...' : 'Finalizar Orden'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toaster para notificaciones */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  );
};

export default AdministracionOrdenes;