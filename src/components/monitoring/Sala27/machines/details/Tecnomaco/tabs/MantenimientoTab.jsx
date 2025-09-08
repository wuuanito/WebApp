import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../ui/card';
import { CheckCircle } from 'lucide-react';

const MantenimientoTab = ({ tecnomacoData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Próximo Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-900">Mantenimiento Preventivo</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha programada:</p>
                <p className="text-base font-medium text-gray-900">{tecnomacoData.proximoMantenimiento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Días restantes:</p>
                <p className="text-base font-medium text-orange-600">12 días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Último Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Fecha:</p>
                <p className="text-base font-medium text-gray-900">{tecnomacoData.ultimoMantenimiento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo:</p>
                <p className="text-base font-medium text-gray-900">Mantenimiento Preventivo</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Técnico:</p>
                <p className="text-base font-medium text-gray-900">Juan Pérez</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MantenimientoTab;