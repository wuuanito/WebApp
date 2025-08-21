import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';
import useWebSocket from '../../../../hooks/useWebSocket';
import Semaforo from './Semaforo';

const Doypack = () => {
  const [gpioStates, setGpioStates] = useState({});
  const [ordenActiva, setOrdenActiva] = useState(null);
  const [ordenLimpieza, setOrdenLimpieza] = useState(null);
  const [tiempoActivo, setTiempoActivo] = useState('00:00:00');
  const [tiempoLimpieza, setTiempoLimpieza] = useState('00:00:00');
  const { data, connectionStatus } = useWebSocket('ws://192.168.20.111:8765');

  useEffect(() => {
    if (data) {
      // Si data es un array (estado inicial), procesarlo
      if (Array.isArray(data)) {
        const states = {};
        data.forEach(item => {
          states[item.pin] = item.value;
        });
        setGpioStates(states);
      } else {
        // Si data es un objeto individual (actualización), actualizarlo
        setGpioStates(prev => ({
          ...prev,
          [data.pin]: data.value
        }));
      }
    }
  }, [data]);

  // Consultar órdenes de fabricación y limpieza
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        // Consultar ambas APIs simultáneamente
        const [responseLimpieza, responseFabricacion] = await Promise.all([
          fetch('http://192.168.11.7:3002/api/ordenes-limpieza'),
          fetch('http://192.168.11.7:3002/api/ordenes-fabricacion')
        ]);
        
        if (!responseLimpieza.ok || !responseFabricacion.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        
        const ordenesLimpieza = await responseLimpieza.json();
        const ordenesFabricacion = await responseFabricacion.json();
        
        // Buscar orden de limpieza activa
        const ordenLimpiezaActiva = ordenesLimpieza.find(orden => 
          orden.estado === 'iniciada' || orden.estado === 'limpiando'
        );
        
        // Buscar orden de fabricación activa
        const ordenFabricacionActiva = ordenesFabricacion.find(orden => 
          orden.estado === 'iniciada' || 
          orden.estado === 'pausada' || 
          orden.estado === 'fabricando'
        );
        
        // Actualizar estados solo si hay cambios
        setOrdenLimpieza(prev => {
          const newValue = ordenLimpiezaActiva || null;
          if (JSON.stringify(prev) !== JSON.stringify(newValue)) {
            return newValue;
          }
          return prev;
        });
        
        setOrdenActiva(prev => {
          const newValue = ordenFabricacionActiva || null;
          if (JSON.stringify(prev) !== JSON.stringify(newValue)) {
            return newValue;
          }
          return prev;
        });
        
      } catch (error) {
        console.error('Error al consultar órdenes:', error);
        // En caso de error, limpiar los estados para evitar mostrar información obsoleta
        setOrdenLimpieza(null);
        setOrdenActiva(null);
      }
    };

    fetchOrdenes();
    
    // Actualizar cada 1 segundo para máxima reactividad
    const interval = setInterval(fetchOrdenes, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'iniciada':
        return 'text-green-600';
      case 'pausada':
        return 'text-orange-600';
      case 'fabricando':
        return 'text-blue-600';
      case 'limpiando':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calcular tiempo activo de producción en tiempo real
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

  // Calcular tiempo activo de limpieza en tiempo real
  useEffect(() => {
    if (!ordenLimpieza || !ordenLimpieza.horaInicio) {
      setTiempoLimpieza('00:00:00');
      return;
    }

    const calcularTiempoLimpieza = () => {
      const horaInicio = new Date(ordenLimpieza.horaInicio);
      const ahora = new Date();
      const diferencia = Math.floor((ahora - horaInicio) / 1000);

      const horas = Math.floor(diferencia / 3600);
      const minutos = Math.floor((diferencia % 3600) / 60);
      const segundos = diferencia % 60;

      const formatoTiempo = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      setTiempoLimpieza(formatoTiempo);
    };

    calcularTiempoLimpieza();
    const timerInterval = setInterval(calcularTiempoLimpieza, 1000);
    return () => clearInterval(timerInterval);
  }, [ordenLimpieza]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Doypack</CardTitle>
        {(ordenActiva || ordenLimpieza) && (
          <CardDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            {/* Orden de Producción */}
             {ordenActiva && (
               <div className="border-l-4 border-blue-500 pl-2 sm:pl-3">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                   <span className="font-medium text-blue-600 text-xs sm:text-sm truncate">
                     Prod: {ordenActiva.codigoOrden}
                   </span>
                   <span className={`font-semibold text-xs px-1 sm:px-2 py-1 rounded ${getEstadoColor(ordenActiva.estado)} bg-gray-100 self-start sm:self-auto`}>
                     {ordenActiva.estado.toUpperCase()}
                   </span>
                 </div>
                 <div className="text-gray-700 text-xs mb-1 truncate">
                   {ordenActiva.producto}
                 </div>
                 {ordenActiva.estado === 'pausada' && ordenActiva.pausas && ordenActiva.pausas.length > 0 && (
                   <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-1">
                     <div className="text-yellow-800 font-semibold text-xs mb-1">
                       Motivo de pausa:
                     </div>
                     <div className="text-yellow-700 text-xs">
                       {ordenActiva.pausas[ordenActiva.pausas.length - 1].tipoPausa}
                     </div>
                     {ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario && (
                       <div className="text-yellow-600 text-xs italic mt-1">
                         "{ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario.trim()}"
                       </div>
                     )}
                   </div>
                 )}
                 <div className="font-mono text-green-600 font-semibold text-xs">
                   T: {tiempoActivo}
                 </div>
               </div>
             )}
            
            {/* Orden de Limpieza */}
            {ordenLimpieza && (
              <div className="border-l-4 border-purple-500 pl-2 sm:pl-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                  <span className="font-medium text-purple-600 text-xs sm:text-sm truncate">
                    Limp: LIMPIEZA-{ordenLimpieza.id}
                  </span>
                  <span className="font-semibold text-xs px-1 sm:px-2 py-1 rounded text-purple-600 bg-gray-100 self-start sm:self-auto">
                    LIMPIANDO
                  </span>
                </div>
                <div className="text-gray-700 text-xs mb-1 truncate">
                  {ordenLimpieza.descripcion}
                </div>
                <div className="font-mono text-purple-600 font-semibold text-xs">
                  T: {tiempoLimpieza}
                </div>
              </div>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex justify-center w-full">
          <Semaforo gpioStates={gpioStates} connectionStatus={connectionStatus} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Doypack;