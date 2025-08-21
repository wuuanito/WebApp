import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../ui/card';
import { 
  Play, 
  Pause, 
  Clock, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

const ProduccionTab = ({ ordenActiva, tiempoActivo, gpioStates }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'fabricando': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pausada': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'iniciada': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'fabricando': return <Play className="w-5 h-5" />;
      case 'pausada': return <Pause className="w-5 h-5" />;
      case 'iniciada': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Estado Actual</p>
                <p className="text-2xl font-bold text-slate-900">
                  {ordenActiva ? ordenActiva.estado.toUpperCase() : 'INACTIVO'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tiempo Activo</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{tiempoActivo || '00:00:00'}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Eficiencia</p>
                <p className="text-2xl font-bold text-slate-900">94.2%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Objetivo Diario</p>
                <p className="text-2xl font-bold text-slate-900">78%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada de la orden */}
      {ordenActiva ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal de la orden */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-slate-600" />
                  <span>Orden de Producción Activa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Estado y código */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                        getStatusColor(ordenActiva.estado)
                      }`}>
                        {getStatusIcon(ordenActiva.estado)}
                        <span className="font-semibold text-sm">{ordenActiva.estado.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Código de Orden</p>
                      <p className="text-xl font-bold text-slate-900">{ordenActiva.codigoOrden}</p>
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Producto</label>
                        <p className="text-lg font-medium text-slate-900 mt-1">{ordenActiva.producto}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Lote</label>
                        <p className="text-lg font-medium text-slate-900 mt-1">{ordenActiva.lote || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de pausas */}
                  {ordenActiva.estado === 'pausada' && ordenActiva.pausas && ordenActiva.pausas.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold text-amber-800">Información de Pausa Activa</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Tipo de Pausa</label>
                          <p className="text-amber-900 font-medium mt-1">{ordenActiva.pausas[ordenActiva.pausas.length - 1].tipoPausa}</p>
                        </div>
                        {ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario && (
                          <div>
                            <label className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Comentario</label>
                            <p className="text-amber-900 italic mt-1 bg-white p-3 rounded border">
                              "{ordenActiva.pausas[ordenActiva.pausas.length - 1].comentario.trim()}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de sensores */}
          <div>
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-slate-600" />
                  <span>Estado de Sensores</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Object.entries(gpioStates).map(([pin, value]) => (
                    <div key={pin} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          value ? 'bg-emerald-500 shadow-emerald-500/50 shadow-lg' : 'bg-red-500 shadow-red-500/50 shadow-lg'
                        }`} />
                        <span className="font-semibold text-slate-700">Pin {pin}</span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        value ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                      }`}>
                        {value ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-300">
          <CardContent className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700">No hay orden de producción activa</h3>
                <p className="text-slate-500 mt-1">Esperando asignación de nueva orden de trabajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProduccionTab;