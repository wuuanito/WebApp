import React, { useState } from 'react';
import { Modal, Tabs, TabContent } from '../../../../../ui/modal';
import { Building2, Activity, Wrench, BarChart3 } from 'lucide-react';
import ProduccionTab from './ProduccionTab';
import LimpiezaTab from './LimpiezaTab';
import MantenimientoTab from './MantenimientoTab';
import EstadisticasTab from './EstadisticasTab';

const VialesPitilloDetails = ({ 
  isOpen, 
  onClose, 
  ordenActiva, 
  ordenLimpieza, 
  tiempoActivo, 
  tiempoLimpieza, 
  gpioStates 
}) => {
  const [activeTab, setActiveTab] = useState('produccion');

  const tabs = [
    { 
      id: 'produccion', 
      label: 'Producción',
      icon: Activity,
      description: 'Monitoreo en tiempo real de la producción'
    },
    { 
      id: 'limpieza', 
      label: 'Limpieza',
      icon: Building2,
      description: 'Protocolos y estado de limpieza'
    },
    { 
      id: 'mantenimiento', 
      label: 'Mantenimiento',
      icon: Wrench,
      description: 'Historial y programación de mantenimiento'
    },
    { 
      id: 'estadisticas', 
      label: 'Estadísticas',
      icon: BarChart3,
      description: 'Análisis de rendimiento y KPIs'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produccion':
        return (
          <ProduccionTab 
            ordenActiva={ordenActiva}
            tiempoActivo={tiempoActivo}
            gpioStates={gpioStates}
          />
        );
      case 'limpieza':
        return (
          <LimpiezaTab 
            ordenLimpieza={ordenLimpieza}
            tiempoLimpieza={tiempoLimpieza}
          />
        );
      case 'mantenimiento':
        return <MantenimientoTab />;
      case 'estadisticas':
        return <EstadisticasTab />;
      default:
        return null;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      className="max-w-[95vw] w-full h-[95vh]"
    >
      {/* Header empresarial */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Viales Pitillo</h1>
              <p className="text-slate-300 text-sm">Sistema de Monitoreo Industrial</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-300">Estado del Sistema</div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Operativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs empresarial */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-left transition-all duration-200 border-b-2 hover:bg-slate-50 ${
                  activeTab === tab.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <div>
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{tab.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-slate-50">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VialesPitilloDetails;