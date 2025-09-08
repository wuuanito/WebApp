import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../../../ui/card';
import { Download, Filter, Calendar, FileSpreadsheet, Settings, Check, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const EstadisticasTab = ({ tecnomacoData }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(10);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    producto: '',
    operador: ''
  });
  const [camposSeleccionados, setCamposSeleccionados] = useState({
    id: true,
    codigoOrden: true,
    codigoArticulo: true,
    producto: true,
    formato: false,
    tipo: false,
    udsBote: false,
    tipoBote: false,
    horaInicio: true,
    horaFin: true,
    cantidadProducir: true,
    numeroCajas: true,
    botesPorCaja: false,
    cajasContadas: false,
    botesBuenos: false,
    repercap: false,
    numeroCorteSanitarioInicial: false,
    numeroCorteSanitarioFinal: false,
    tiempoEstimadoProduccion: true,
    tiempoTotalActivo: true,
    tiempoTotalPausas: true,
    tiempoTotal: true,
    horaPausaFinMaquina: false,
    tiempoTotalHastaPausaFinMaquina: false,
    tiempoActivoHastaPausaFinMaquina: false,
    tiempoPausasHastaPausaFinMaquina: false,
    unidadesCierreFin: false,
    unidadesNoOkFin: false,
    totalUnidades: true,
    botesPonderal: false,
    botesExpulsados: false,
    recirculacionRepercap: false,
    recirculacionPonderal: false,
    porcentajeUnidadesOk: true,
    porcentajeUnidadesNoOk: false,
    porcentajePausas: false,
    porcentajeCompletado: true,
    tasaExpulsion: false,
    tasaRecuperacionPonderal: false,
    tasaRecuperacionRepercap: false,
    standardReal: false,
    standardRealVsTeorico: false,
    disponibilidad: true,
    rendimiento: true,
    calidad: true,
    oee: true,
    estado: true,
    createdAt: false,
    updatedAt: false,
    // Campos de pausas
    numeroPausas: false,
    tiempoTotalPausasDetalle: false,
    pausasPrincipales: false
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarCampos, setMostrarCampos] = useState(false);

  const camposDisponibles = [
    { key: 'id', label: 'ID', descripcion: 'Identificador único de la orden' },
    { key: 'codigoOrden', label: 'Código Orden', descripcion: 'Código de la orden de fabricación' },
    { key: 'codigoArticulo', label: 'Código Artículo', descripcion: 'Código del artículo a producir' },
    { key: 'producto', label: 'Producto', descripcion: 'Descripción completa del producto' },
    { key: 'formato', label: 'Formato', descripcion: 'Formato del producto' },
    { key: 'tipo', label: 'Tipo', descripcion: 'Tipo de producto' },
    { key: 'udsBote', label: 'Uds por Bote', descripcion: 'Unidades por bote' },
    { key: 'tipoBote', label: 'Tipo Bote', descripcion: 'Tipo de bote utilizado' },
    { key: 'horaInicio', label: 'Hora Inicio', descripcion: 'Fecha y hora de inicio de producción' },
    { key: 'horaFin', label: 'Hora Fin', descripcion: 'Fecha y hora de finalización' },
    { key: 'cantidadProducir', label: 'Cantidad a Producir', descripcion: 'Cantidad planificada a producir' },
    { key: 'numeroCajas', label: 'Número de Cajas', descripcion: 'Número total de cajas' },
    { key: 'botesPorCaja', label: 'Botes por Caja', descripcion: 'Cantidad de botes por caja' },
    { key: 'cajasContadas', label: 'Cajas Contadas', descripcion: 'Número de cajas contadas' },
    { key: 'botesBuenos', label: 'Botes Buenos', descripcion: 'Cantidad de botes en buen estado' },
    { key: 'repercap', label: 'Repercap', descripcion: 'Indicador de repercap' },
    { key: 'numeroCorteSanitarioInicial', label: 'Corte Sanitario Inicial', descripcion: 'Número de corte sanitario inicial' },
    { key: 'numeroCorteSanitarioFinal', label: 'Corte Sanitario Final', descripcion: 'Número de corte sanitario final' },
    { key: 'tiempoEstimadoProduccion', label: 'Tiempo Estimado', descripcion: 'Tiempo estimado de producción en minutos' },
    { key: 'tiempoTotalActivo', label: 'Tiempo Total Activo', descripcion: 'Tiempo total activo en minutos' },
    { key: 'tiempoTotalPausas', label: 'Tiempo Total Pausas', descripcion: 'Tiempo total de pausas en minutos' },
    { key: 'tiempoTotal', label: 'Tiempo Total', descripcion: 'Tiempo total de la orden en minutos' },
    { key: 'horaPausaFinMaquina', label: 'Hora Pausa Fin Máquina', descripcion: 'Hora de pausa fin de máquina' },
    { key: 'tiempoTotalHastaPausaFinMaquina', label: 'Tiempo Hasta Pausa Fin', descripcion: 'Tiempo total hasta pausa fin máquina' },
    { key: 'tiempoActivoHastaPausaFinMaquina', label: 'Tiempo Activo Hasta Pausa', descripcion: 'Tiempo activo hasta pausa fin máquina' },
    { key: 'tiempoPausasHastaPausaFinMaquina', label: 'Pausas Hasta Fin', descripcion: 'Tiempo de pausas hasta fin máquina' },
    { key: 'unidadesCierreFin', label: 'Unidades Cierre Fin', descripcion: 'Unidades de cierre al final' },
    { key: 'unidadesNoOkFin', label: 'Unidades No OK Fin', descripcion: 'Unidades no conformes al final' },
    { key: 'totalUnidades', label: 'Total Unidades', descripcion: 'Total de unidades producidas' },
    { key: 'botesPonderal', label: 'Botes Ponderal', descripcion: 'Cantidad de botes ponderales' },
    { key: 'botesExpulsados', label: 'Botes Expulsados', descripcion: 'Cantidad de botes expulsados' },
    { key: 'recirculacionRepercap', label: 'Recirculación Repercap', descripcion: 'Recirculación repercap' },
    { key: 'recirculacionPonderal', label: 'Recirculación Ponderal', descripcion: 'Recirculación ponderal' },
    { key: 'porcentajeUnidadesOk', label: '% Unidades OK', descripcion: 'Porcentaje de unidades conformes' },
    { key: 'porcentajeUnidadesNoOk', label: '% Unidades No OK', descripcion: 'Porcentaje de unidades no conformes' },
    { key: 'porcentajePausas', label: '% Pausas', descripcion: 'Porcentaje de tiempo en pausas' },
    { key: 'porcentajeCompletado', label: '% Completado', descripcion: 'Porcentaje de completado' },
    { key: 'tasaExpulsion', label: 'Tasa Expulsión', descripcion: 'Tasa de expulsión de productos' },
    { key: 'tasaRecuperacionPonderal', label: 'Tasa Recuperación Ponderal', descripcion: 'Tasa de recuperación ponderal' },
    { key: 'tasaRecuperacionRepercap', label: 'Tasa Recuperación Repercap', descripcion: 'Tasa de recuperación repercap' },
    { key: 'standardReal', label: 'Standard Real', descripcion: 'Standard real de producción' },
    { key: 'standardRealVsTeorico', label: 'Standard Real vs Teórico', descripcion: 'Comparación standard real vs teórico' },
    { key: 'disponibilidad', label: 'Disponibilidad', descripcion: 'Porcentaje de disponibilidad' },
    { key: 'rendimiento', label: 'Rendimiento', descripcion: 'Porcentaje de rendimiento' },
    { key: 'calidad', label: 'Calidad', descripcion: 'Porcentaje de calidad' },
    { key: 'oee', label: 'OEE', descripcion: 'Overall Equipment Effectiveness' },
    { key: 'estado', label: 'Estado', descripcion: 'Estado actual de la orden' },
    { key: 'createdAt', label: 'Fecha Creación', descripcion: 'Fecha de creación del registro' },
    { key: 'updatedAt', label: 'Fecha Actualización', descripcion: 'Fecha de última actualización' },
    // Campos de pausas
    { key: 'numeroPausas', label: 'Número de Pausas', descripcion: 'Cantidad total de pausas registradas' },
    { key: 'tiempoTotalPausasDetalle', label: 'Tiempo Total Pausas (Detalle)', descripcion: 'Suma de duración de todas las pausas' },
    { key: 'pausasPrincipales', label: 'Pausas Principales', descripcion: 'Lista de tipos de pausas más frecuentes' }
  ];

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.11.7:3005/api/ordenes-fabricacion');
      if (response.ok) {
        const data = await response.json();
        // Cargar detalles completos de cada orden incluyendo pausas
        const ordenesConPausas = await Promise.all(
          data.map(async (orden) => {
            try {
              const detalleResponse = await fetch(`http://192.168.11.7:3005/api/ordenes-fabricacion/${orden.id}`);
              if (detalleResponse.ok) {
                const detalleCompleto = await detalleResponse.json();
                return detalleCompleto;
              }
              return orden;
            } catch (error) {
              console.error(`Error al cargar detalles de orden ${orden.id}:`, error);
              return orden;
            }
          })
        );
        setOrdenes(ordenesConPausas);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (ordenes) => {
    return ordenes.filter(orden => {
      const cumpleFechaInicio = !filtros.fechaInicio || 
        new Date(orden.fechaInicio) >= new Date(filtros.fechaInicio);
      const cumpleFechaFin = !filtros.fechaFin || 
        new Date(orden.fechaFin) <= new Date(filtros.fechaFin);
      const cumpleEstado = !filtros.estado || 
        orden.estado.toLowerCase().includes(filtros.estado.toLowerCase());
      const cumpleProducto = !filtros.producto || 
        orden.producto.toLowerCase().includes(filtros.producto.toLowerCase());
      const cumpleOperador = !filtros.operador || 
        orden.operador.toLowerCase().includes(filtros.operador.toLowerCase());
      
      return cumpleFechaInicio && cumpleFechaFin && cumpleEstado && cumpleProducto && cumpleOperador;
    });
  };

  const exportarExcel = () => {
    const ordenesFiltradas = aplicarFiltros(ordenes);
    const camposActivos = Object.keys(camposSeleccionados).filter(key => camposSeleccionados[key]);
    
    // Datos de órdenes
    const datosExportacion = ordenesFiltradas.map(orden => {
      const fila = {};
      
      // Calcular campos de pausas
      const pausas = orden.pausas || [];
      const numeroPausas = pausas.length;
      const tiempoTotalPausasDetalle = pausas.reduce((total, pausa) => total + (pausa.duracion || 0), 0);
      const tiposPausas = pausas.map(p => p.tipoPausa).filter(Boolean);
      const pausasPrincipales = [...new Set(tiposPausas)].join(', ');
      
      // Agregar campos calculados al objeto orden
      const ordenConPausas = {
        ...orden,
        numeroPausas,
        tiempoTotalPausasDetalle,
        pausasPrincipales
      };
      
      camposActivos.forEach(campo => {
        const campoInfo = camposDisponibles.find(c => c.key === campo);
        fila[campoInfo?.label || campo] = ordenConPausas[campo] || '';
      });
      return fila;
    });

    // Datos de pausas
    const datosPausas = [];
    ordenesFiltradas.forEach(orden => {
      if (orden.pausas && Array.isArray(orden.pausas)) {
        orden.pausas.forEach(pausa => {
          datosPausas.push({
            'ID Orden': orden.id,
            'Código Orden': orden.codigoOrden,
            'Producto': orden.producto,
            'Fecha Inicio Pausa': pausa.horaInicio ? new Date(pausa.horaInicio).toLocaleString() : '',
            'Fecha Fin Pausa': pausa.horaFin ? new Date(pausa.horaFin).toLocaleString() : '',
            'Duración (min)': pausa.duracion || '',
            'Tipo de Pausa': pausa.tipoPausa || '',
            'Comentario': pausa.comentario || '',
            'Computa en Tiempo': pausa.computaEnTiempo ? 'Sí' : 'No'
          });
        });
      }
    });

    const workbook = XLSX.utils.book_new();
    
    // Hoja de órdenes
    const worksheetOrdenes = XLSX.utils.json_to_sheet(datosExportacion);
    XLSX.utils.book_append_sheet(workbook, worksheetOrdenes, 'Órdenes de Fabricación');
    
    // Hoja de pausas (solo si hay pausas)
    if (datosPausas.length > 0) {
      const worksheetPausas = XLSX.utils.json_to_sheet(datosPausas);
      XLSX.utils.book_append_sheet(workbook, worksheetPausas, 'Pausas Detalladas');
    }
    
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `ordenes_fabricacion_${fecha}.xlsx`;
    
    XLSX.writeFile(workbook, nombreArchivo);
  };

  const toggleCampo = (campo) => {
    setCamposSeleccionados(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const seleccionarTodos = () => {
    const nuevoEstado = {};
    camposDisponibles.forEach(campo => {
      nuevoEstado[campo.key] = true;
    });
    setCamposSeleccionados(nuevoEstado);
  };

  const deseleccionarTodos = () => {
    const nuevoEstado = {};
    camposDisponibles.forEach(campo => {
      nuevoEstado[campo.key] = false;
    });
    setCamposSeleccionados(nuevoEstado);
  };

  const ordenesFiltradas = aplicarFiltros(ordenes);
  const camposActivos = Object.keys(camposSeleccionados).filter(key => camposSeleccionados[key]);
  
  // Cálculos de paginación
  const totalPaginas = Math.ceil(ordenesFiltradas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const ordenesPaginadas = ordenesFiltradas.slice(indiceInicio, indiceFin);
  
  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtros]);

  return (
    <div className="space-y-6">
    
    

      {/* Controles principales */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
        <button
          onClick={() => setMostrarCampos(!mostrarCampos)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Seleccionar Campos</span>
        </button>
        <button
          onClick={exportarExcel}
          disabled={ordenesFiltradas.length === 0 || camposActivos.length === 0}
          className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar a Excel</span>
        </button>
      </div>

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <Card className="border border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros de Exportación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio (desde)
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin (hasta)
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  placeholder="Filtrar por estado..."
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                <input
                  type="text"
                  placeholder="Filtrar por producto..."
                  value={filtros.producto}
                  onChange={(e) => setFiltros(prev => ({ ...prev, producto: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operador
                </label>
                <input
                  type="text"
                  placeholder="Filtrar por operador..."
                  value={filtros.operador}
                  onChange={(e) => setFiltros(prev => ({ ...prev, operador: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setFiltros({ fechaInicio: '', fechaFin: '', estado: '', producto: '', operador: '' })}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de selección de campos */}
      {mostrarCampos && (
        <Card className="border border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Seleccionar Campos para Exportar
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={seleccionarTodos}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                  Seleccionar Todos
                </button>
                <button
                  onClick={deseleccionarTodos}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Deseleccionar Todos
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {camposDisponibles.map((campo) => (
                <div
                  key={campo.key}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    camposSeleccionados[campo.key]
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleCampo(campo.key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        camposSeleccionados[campo.key]
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {camposSeleccionados[campo.key] && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{campo.label}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{campo.descripcion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vista previa de datos esenciales */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vista Previa de Datos</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando órdenes...</p>
            </div>
          ) : ordenesFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Código Orden</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora Inicio</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">OEE</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesPaginadas.map((orden, index) => (
                    <tr key={orden.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{orden.codigoOrden || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={orden.producto}>
                          {orden.producto || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{orden.cantidadProducir?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          orden.estado === 'completada' ? 'bg-green-100 text-green-800' :
                          orden.estado === 'iniciada' ? 'bg-blue-100 text-blue-800' :
                          orden.estado === 'pausada' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {orden.estado || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {orden.horaInicio ? new Date(orden.horaInicio).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {orden.oee ? `${orden.oee.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Controles de paginación */}
              {totalPaginas > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Mostrando {indiceInicio + 1} a {Math.min(indiceFin, ordenesFiltradas.length)} de {ordenesFiltradas.length} órdenes
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                      disabled={paginaActual === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                        let pageNum;
                        if (totalPaginas <= 5) {
                          pageNum = i + 1;
                        } else if (paginaActual <= 3) {
                          pageNum = i + 1;
                        } else if (paginaActual >= totalPaginas - 2) {
                          pageNum = totalPaginas - 4 + i;
                        } else {
                          pageNum = paginaActual - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPaginaActual(pageNum)}
                            className={`px-3 py-1 border rounded-md text-sm ${
                              paginaActual === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                      disabled={paginaActual === totalPaginas}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay órdenes que coincidan con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadisticasTab;