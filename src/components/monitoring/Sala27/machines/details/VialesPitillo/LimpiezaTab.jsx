import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../ui/card';
import { 
  Droplets, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ClipboardCheck,
  Spray,
  Shield,
  Timer,
  FileText
} from 'lucide-react';

const LimpiezaTab = ({ ordenLimpieza, tiempoLimpieza }) => {
  const protocolSteps = [
    {
      id: 1,
      title: "Parada y Vaciado",
      description: "Parada de máquina y vaciado completo de producto",
      icon: AlertCircle,
      duration: "5 min",
      status: "completed"
    },
    {
      id: 2,
      title: "Desmontaje",
      description: "Desmontaje de piezas removibles y accesorios",
      icon: ClipboardCheck,
      duration: "10 min",
      status: "completed"
    },
    {
      id: 3,
      title: "Pre-limpieza",
      description: "Limpieza inicial con agua y detergente industrial",
      icon: Droplets,
      duration: "15 min",
      status: "in-progress"
    },
    {
      id: 4,
      title: "Enjuague",
      description: "Enjuague completo con agua potable a presión",
      icon: Spray,
      duration: "8 min",
      status: "pending"
    },
    {
      id: 5,
      title: "Desinfección",
      description: "Aplicación de desinfectante alcohol 70%",
      icon: Shield,
      duration: "10 min",
      status: "pending"
    },
    {
      id: 6,
      title: "Secado y Montaje",
      description: "Secado natural y montaje de componentes",
      icon: Timer,
      duration: "20 min",
      status: "pending"
    },
    {
      id: 7,
      title: "Verificación",
      description: "Inspección final y documentación del proceso",
      icon: FileText,
      duration: "5 min",
      status: "pending"
    }
  ];

  const getStepStatus = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white animate-pulse';
      case 'pending':
        return 'bg-slate-200 text-slate-600';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  const getStepBorder = (status) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-200 bg-emerald-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-slate-200 bg-slate-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con métricas de limpieza */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Estado</p>
                <p className="text-2xl font-bold text-slate-900">
                  {ordenLimpieza ? 'LIMPIANDO' : 'INACTIVO'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Droplets className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tiempo Transcurrido</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{tiempoLimpieza || '00:00:00'}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Progreso</p>
                <p className="text-2xl font-bold text-slate-900">28%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tiempo Estimado</p>
                <p className="text-2xl font-bold text-slate-900">73 min</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Timer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada de la orden */}
      {ordenLimpieza ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la orden */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardCheck className="w-5 h-5 text-purple-600" />
                  <span>Orden de Limpieza</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                      <Droplets className="w-4 h-4" />
                      <span className="font-semibold text-sm">LIMPIEZA ACTIVA</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">ID de Limpieza</label>
                      <p className="text-lg font-bold text-slate-900 mt-1">LIMPIEZA-{ordenLimpieza.id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Descripción</label>
                      <p className="text-slate-900 mt-1">{ordenLimpieza.descripcion}</p>
                    </div>
                    
                    {ordenLimpieza.horaInicio && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hora de Inicio</label>
                        <p className="text-slate-900 mt-1">{new Date(ordenLimpieza.horaInicio).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {ordenLimpieza.tipoLimpieza && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tipo de Limpieza</label>
                        <p className="text-slate-900 mt-1 font-medium">{ordenLimpieza.tipoLimpieza}</p>
                      </div>
                    )}
                    
                    {ordenLimpieza.operador && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Operador Responsable</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="w-4 h-4 text-slate-600" />
                          <p className="text-slate-900 font-medium">{ordenLimpieza.operador}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocolo de limpieza */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span>Protocolo de Limpieza Industrial</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {protocolSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className={`border rounded-lg p-4 transition-all duration-200 ${getStepBorder(step.status)}`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getStepStatus(step.status)}`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-slate-900">{step.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-500 font-medium">{step.duration}</span>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm mt-1">{step.description}</p>
                          </div>
                        </div>
                        {step.status === 'in-progress' && (
                          <div className="mt-3">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1 font-medium">En progreso...</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                <Droplets className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700">No hay orden de limpieza activa</h3>
                <p className="text-slate-500 mt-1">El equipo está listo para producción</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LimpiezaTab;