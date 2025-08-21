import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../ui/card';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench,
  Settings,
  User,
  Bell,
  TrendingUp,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';

const MantenimientoTab = () => {
  // Datos de ejemplo para mantenimiento
  const proximoMantenimiento = {
    tipo: 'Mantenimiento Preventivo',
    fecha: '2024-02-15',
    descripcion: 'Revisión general de componentes y lubricación',
    diasRestantes: 5,
    prioridad: 'alta'
  };

  const ultimoMantenimiento = {
    tipo: 'Mantenimiento Correctivo',
    fecha: '2024-01-20',
    descripcion: 'Reemplazo de sensor de presión',
    tecnico: 'Juan Pérez',
    duracion: '2.5 horas',
    costo: '$450'
  };

  const alertas = [
    {
      id: 1,
      tipo: 'critical',
      mensaje: 'Próximo mantenimiento preventivo en 5 días',
      fecha: '2024-02-10',
      componente: 'Sistema Hidráulico'
    },
    {
      id: 2,
      tipo: 'warning',
      mensaje: 'Lubricación de rodamientos recomendada',
      fecha: '2024-02-08',
      componente: 'Motor Principal'
    },
    {
      id: 3,
      tipo: 'info',
      mensaje: 'Calibración de sensores programada',
      fecha: '2024-02-12',
      componente: 'Sistema de Control'
    }
  ];

  const historialMantenimiento = [
    {
      id: 1,
      fecha: '2024-01-20',
      tipo: 'Correctivo',
      descripcion: 'Reemplazo de sensor de presión',
      tecnico: 'Juan Pérez',
      estado: 'Completado',
      duracion: '2.5h',
      costo: '$450'
    },
    {
      id: 2,
      fecha: '2024-01-05',
      tipo: 'Preventivo',
      descripcion: 'Revisión general y lubricación',
      tecnico: 'María García',
      estado: 'Completado',
      duracion: '4h',
      costo: '$320'
    },
    {
      id: 3,
      fecha: '2023-12-15',
      tipo: 'Preventivo',
      descripcion: 'Calibración de sensores',
      tecnico: 'Carlos López',
      estado: 'Completado',
      duracion: '1.5h',
      costo: '$180'
    },
    {
      id: 4,
      fecha: '2023-11-28',
      tipo: 'Correctivo',
      descripcion: 'Reparación de válvula neumática',
      tecnico: 'Ana Martínez',
      estado: 'Completado',
      duracion: '3h',
      costo: '$680'
    }
  ];

  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case 'critical': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (tipo) => {
    switch (tipo) {
      case 'critical': return 'border-red-400 bg-red-50 text-red-800';
      case 'warning': return 'border-amber-400 bg-amber-50 text-amber-800';
      case 'info': return 'border-blue-400 bg-blue-50 text-blue-800';
      default: return 'border-slate-400 bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con métricas de mantenimiento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Alertas Críticas</p>
                <p className="text-2xl font-bold text-slate-900">1</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Próximo Mantenimiento</p>
                <p className="text-2xl font-bold text-slate-900">{proximoMantenimiento.diasRestantes}d</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Disponibilidad</p>
                <p className="text-2xl font-bold text-slate-900">98.2%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Costo Mensual</p>
                <p className="text-2xl font-bold text-slate-900">$1,630</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y próximo mantenimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas de mantenimiento */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Alertas de Mantenimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {alertas.map((alerta) => (
                  <div key={alerta.id} className={`border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getAlertColor(alerta.tipo)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          alerta.tipo === 'critical' ? 'bg-red-100' :
                          alerta.tipo === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          {getAlertIcon(alerta.tipo)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm uppercase tracking-wide">{alerta.componente}</h4>
                          <p className="font-medium mt-1">{alerta.mensaje}</p>
                          <p className="text-sm opacity-75 mt-1">{alerta.fecha}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        alerta.tipo === 'critical' ? 'bg-red-200 text-red-800' :
                        alerta.tipo === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {alerta.tipo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Próximo mantenimiento */}
        <div>
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Próximo Mantenimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${
                    proximoMantenimiento.prioridad === 'alta' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    <Settings className="w-4 h-4" />
                    <span className="font-semibold text-sm">PROGRAMADO</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tipo de Mantenimiento</label>
                    <p className="text-lg font-bold text-slate-900 mt-1">{proximoMantenimiento.tipo}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Fecha Programada</label>
                    <p className="text-slate-900 mt-1 font-medium">{proximoMantenimiento.fecha}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Días Restantes</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <p className="text-slate-900 font-bold">{proximoMantenimiento.diasRestantes} días</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Descripción</label>
                    <p className="text-slate-900 mt-1">{proximoMantenimiento.descripcion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Último mantenimiento y historial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Último mantenimiento */}
        <div>
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Último Mantenimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold text-sm">COMPLETADO</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tipo</label>
                    <p className="text-lg font-bold text-slate-900 mt-1">{ultimoMantenimiento.tipo}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Fecha</label>
                    <p className="text-slate-900 mt-1 font-medium">{ultimoMantenimiento.fecha}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Técnico Responsable</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="w-4 h-4 text-slate-600" />
                      <p className="text-slate-900 font-medium">{ultimoMantenimiento.tecnico}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Duración</label>
                      <p className="text-slate-900 mt-1 font-medium">{ultimoMantenimiento.duracion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Costo</label>
                      <p className="text-slate-900 mt-1 font-bold">{ultimoMantenimiento.costo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Descripción</label>
                    <p className="text-slate-900 mt-1">{ultimoMantenimiento.descripcion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de mantenimiento */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <span>Historial de Mantenimiento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Descripción</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Técnico</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Duración</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm uppercase tracking-wide">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialMantenimiento.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-900 font-medium">{item.fecha}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            item.tipo === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-900">{item.descripcion}</td>
                        <td className="py-3 px-4 text-slate-900">{item.tecnico}</td>
                        <td className="py-3 px-4 text-slate-900 font-mono">{item.duracion}</td>
                        <td className="py-3 px-4 text-slate-900 font-bold">{item.costo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MantenimientoTab;