import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Settings, 
  BarChart3,
  AlertTriangle,
  Database
} from 'lucide-react';
import ProduccionTab from './tabs/ProduccionTab';
import OrdenesFabricacionTab from './tabs/OrdenesFabricacionTab';
import EstadisticasTab from './tabs/EstadisticasTab';
import MantenimientoTab from './tabs/MantenimientoTab';
import InsercionDatosTab from './tabs/InsercionDatosTab';

const CremerDetails = ({ isOpen, onClose, machineData }) => {
  const [activeTab, setActiveTab] = useState('produccion');

  if (!isOpen) return null;

  // Datos de ejemplo para la máquina Cremer
  const cremerData = {
    estado: 'PRODUCIENDO',
    tiempoActivo: '04:32:15',
    velocidad: '850 rpm',
    temperatura: '65°C',
    presion: '2.3 bar',
    eficiencia: '92.5%',
    produccionHoy: '2,450 unidades',
    objetivo: '3,000 unidades',
    ultimoMantenimiento: '2024-01-15',
    proximoMantenimiento: '2024-02-15',
    operador: 'Carlos Mendez',
    turno: 'Mañana',
    lote: 'CR-2024-001'
  };

  const tabs = [
    { id: 'produccion', label: 'Producción', icon: Activity },
    { id: 'parametros', label: 'Órdenes de Fabricación', icon: Settings },
    { id: 'insercion', label: 'Inserción de Datos', icon: Database },
    { id: 'estadisticas', label: 'Exportar Datos', icon: BarChart3 },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: AlertTriangle }
  ];









  const renderTabContent = () => {
    switch (activeTab) {
      case 'produccion':
        return <ProduccionTab cremerData={cremerData} />;
      case 'parametros':
        return <OrdenesFabricacionTab />;
      case 'insercion':
        return <InsercionDatosTab cremerData={cremerData} />;
      case 'estadisticas':
        return <EstadisticasTab cremerData={cremerData} />;
      case 'mantenimiento':
        return <MantenimientoTab cremerData={cremerData} />;
      default:
        return <ProduccionTab cremerData={cremerData} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cremer</h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CremerDetails;