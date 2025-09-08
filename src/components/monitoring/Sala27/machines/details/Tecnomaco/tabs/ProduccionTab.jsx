import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../ui/card';
import { 
  Activity, 
  Clock, 
  Power,
  BarChart3,
  Thermometer,
  Gauge,
  Settings
} from 'lucide-react';

const ProduccionTab = ({ tecnomacoData }) => {
  const [ordenActiva, setOrdenActiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tiempoActivo, setTiempoActivo] = useState('00:00:00');

  // Obtener orden activa de la API
  useEffect(() => {
    const fetchOrdenActiva = async () => {
      try {
        const response = await fetch('http://192.168.11.7:3005/api/ordenes-fabricacion');
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        
        const ordenes = await response.json();
        const ordenIniciada = ordenes.find(orden => 
          orden.estado === 'iniciada' || 
          orden.estado === 'pausada' || 
          orden.estado === 'fabricando'
        );
        
        setOrdenActiva(ordenIniciada || null);
      } catch (error) {
        console.error('Error al obtener orden activa:', error);
        setOrdenActiva(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenActiva();
    const interval = setInterval(fetchOrdenActiva, 5000); // Actualizar cada 5 segundos
    
    return () => clearInterval(interval);
  }, []);

  // Calcular tiempo activo en tiempo real
  useEffect(() => {
    if (!ordenActiva || !ordenActiva.horaInicio) {
      setTiempoActivo('00:00:00');
      return;
    }

    const calcularTiempoActivo = () => {
      const horaInicio = new Date(ordenActiva.horaInicio);
      const ahora = new Date();
      const diferencia = Math.floor((ahora - horaInicio) / 1000);

      const horas = Math.floor(diferencia / 3600);
      const minutos = Math.floor((diferencia % 3600) / 60);
      const segundos = diferencia % 60;

      const formatoTiempo = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      setTiempoActivo(formatoTiempo);
    };

    calcularTiempoActivo();
    const timerInterval = setInterval(calcularTiempoActivo, 1000);
    return () => clearInterval(timerInterval);
  }, [ordenActiva]);

  // Calcular porcentaje de progreso
  const calcularProgreso = () => {
    if (!ordenActiva || !ordenActiva.cantidadProducir || !ordenActiva.botesBuenos) {
      return 0;
    }
    return Math.min((ordenActiva.botesBuenos / ordenActiva.cantidadProducir) * 100, 100);
  };

  // Obtener estado de la máquina
  const getEstadoMaquina = () => {
    if (!ordenActiva) return 'Inactivo';
    
    switch (ordenActiva.estado) {
      case 'iniciada':
      case 'fabricando':
        return 'Produciendo';
      case 'pausada':
        return 'Pausado';
      default:
        return 'Inactivo';
    }
  };

  // Obtener color del estado
  const getEstadoColor = () => {
    const estado = getEstadoMaquina();
    switch (estado) {
      case 'Produciendo':
        return 'text-green-600';
      case 'Pausado':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando información de producción...</div>
        </div>
      </div>
    );
  }

  if (!ordenActiva) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">No hay orden de producción activa</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className={`text-lg font-semibold ${getEstadoColor()}`}>{getEstadoMaquina()}</p>
              </div>
              <Power className={`w-5 h-5 ${getEstadoMaquina() === 'Produciendo' ? 'text-green-500' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Activo</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{tiempoActivo}</p>
              </div>
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progreso</p>
                <p className="text-lg font-semibold text-blue-600">{calcularProgreso().toFixed(1)}%</p>
              </div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Producidos</p>
                <p className="text-lg font-semibold text-gray-900">{ordenActiva.botesBuenos || 0}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Información de Producción</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Código Orden:</span>
                <span className="font-medium text-gray-900">{ordenActiva.codigoOrden}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Artículo:</span>
                <span className="font-medium text-gray-900">{ordenActiva.codigoArticulo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad a Producir:</span>
                <span className="font-medium text-gray-900">{ordenActiva.cantidadProducir?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cajas Objetivo:</span>
                <span className="font-medium text-gray-900">{ordenActiva.numeroCajas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Botes por Caja:</span>
                <span className="font-medium text-gray-900">{ordenActiva.botesPorCaja || 0}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Progreso de producción</span>
                  <span className="text-sm font-medium text-gray-900">{calcularProgreso().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${calcularProgreso()}%`}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Estadísticas de Producción</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
            
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Cajas Contadas:</span>
                </div>
                <span className="font-medium text-blue-600">{ordenActiva.cajasContadas || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">Tiempo Estimado:</span>
                </div>
                <span className="font-medium text-orange-600">{ordenActiva.tiempoEstimadoProduccion?.toFixed(1) || 0} min</span>
              </div>
              {ordenActiva.estado === 'pausada' && ordenActiva.pausas && ordenActiva.pausas.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="text-yellow-800 font-semibold text-sm mb-1">
                    Estado: Pausado
                  </div>
                  <div className="text-yellow-700 text-sm">
                    Motivo: {ordenActiva.pausas[ordenActiva.pausas.length - 1].tipoPausa}
                  </div>
                  {ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario && (
                    <div className="text-yellow-600 text-xs italic mt-1">
                      "{ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario.trim()}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProduccionTab;