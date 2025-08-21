import React, { useState } from 'react';
import { Modal, Tabs, TabContent } from '../../../../../ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../ui/card';
import { Activity, Settings, BarChart3, Wrench } from 'lucide-react';

const MonolabDetails = ({ isOpen, onClose, machineData }) => {
  const [activeTab, setActiveTab] = useState('produccion');

  const tabs = [
    { id: 'produccion', label: 'Producción' },
    { id: 'limpieza', label: 'Limpieza' },
    { id: 'mantenimiento', label: 'Mantenimiento' },
    { id: 'estadisticas', label: 'Estadísticas' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produccion':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Estado de Producción - Monolab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado Actual</label>
                    <p className="text-lg font-semibold text-green-600">OPERANDO</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Velocidad</label>
                    <p className="text-lg font-semibold">2,450 u/h</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Producto Actual</label>
                    <p className="text-lg">Tabletas Paracetamol 500mg</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Lote</label>
                    <p className="text-lg font-mono">LOT-2024-001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'limpieza':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-500" />
                  Protocolo de Limpieza - Monolab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Información específica de limpieza para Monolab...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'mantenimiento':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-orange-500" />
                  Mantenimiento - Monolab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Información de mantenimiento específica para Monolab...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'estadisticas':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                  Estadísticas - Monolab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Estadísticas específicas para Monolab...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Monolab - Detalles"
      className="max-w-6xl"
    >
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <TabContent>
        {renderTabContent()}
      </TabContent>
    </Modal>
  );
};

export default MonolabDetails;