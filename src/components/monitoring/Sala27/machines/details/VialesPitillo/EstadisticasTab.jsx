import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../ui/card';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const EstadisticasTab = () => {
  // Datos de ejemplo para estadísticas
  const estadisticasHoy = {
    tiempoOperacion: '6:45:30',
    tiempoParada: '1:14:30',
    eficiencia: 85.2,
    unidadesProducidas: 12450,
    velocidadPromedio: 1850
  };

  const estadisticasSemana = {
    tiempoOperacion: '38:20:15',
    tiempoParada: '9:39:45',
    eficiencia: 79.8,
    unidadesProducidas: 89320,
    velocidadPromedio: 1780
  };

  const estadisticasMes = {
    tiempoOperacion: '165:45:30',
    tiempoParada: '42:14:30',
    eficiencia: 79.7,
    unidadesProducidas: 385670,
    velocidadPromedio: 1795
  };

  const tiemposParada = [
    { motivo: 'Cambio de formato', tiempo: '45:30', porcentaje: 35 },
    { motivo: 'Mantenimiento', tiempo: '20:15', porcentaje: 25 },
    { motivo: 'Falta de material', tiempo: '15:45', porcentaje: 20 },
    { motivo: 'Limpieza', tiempo: '12:30', porcentaje: 15 },
    { motivo: 'Otros', tiempo: '6:00', porcentaje: 5 }
  ];

  const tendencias = [
    { periodo: 'Última semana', eficiencia: 79.8, cambio: 2.3, tipo: 'up' },
    { periodo: 'Último mes', eficiencia: 79.7, cambio: -1.2, tipo: 'down' },
    { periodo: 'Último trimestre', eficiencia: 81.5, cambio: 4.8, tipo: 'up' }
  ];

  return (
    <div className="space-y-4">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hoy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">Hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estadisticasHoy.eficiencia}%</p>
              <p className="text-sm text-gray-600">Eficiencia</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tiempo Operación:</span>
                <span className="font-semibold">{estadisticasHoy.tiempoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Parada:</span>
                <span className="font-semibold text-red-600">{estadisticasHoy.tiempoParada}</span>
              </div>
              <div className="flex justify-between">
                <span>Unidades:</span>
                <span className="font-semibold">{estadisticasHoy.unidadesProducidas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Velocidad Prom:</span>
                <span className="font-semibold">{estadisticasHoy.velocidadPromedio} u/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semana */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estadisticasSemana.eficiencia}%</p>
              <p className="text-sm text-gray-600">Eficiencia</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tiempo Operación:</span>
                <span className="font-semibold">{estadisticasSemana.tiempoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Parada:</span>
                <span className="font-semibold text-red-600">{estadisticasSemana.tiempoParada}</span>
              </div>
              <div className="flex justify-between">
                <span>Unidades:</span>
                <span className="font-semibold">{estadisticasSemana.unidadesProducidas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Velocidad Prom:</span>
                <span className="font-semibold">{estadisticasSemana.velocidadPromedio} u/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">Este Mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{estadisticasMes.eficiencia}%</p>
              <p className="text-sm text-gray-600">Eficiencia</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tiempo Operación:</span>
                <span className="font-semibold">{estadisticasMes.tiempoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Parada:</span>
                <span className="font-semibold text-red-600">{estadisticasMes.tiempoParada}</span>
              </div>
              <div className="flex justify-between">
                <span>Unidades:</span>
                <span className="font-semibold">{estadisticasMes.unidadesProducidas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Velocidad Prom:</span>
                <span className="font-semibold">{estadisticasMes.velocidadPromedio} u/h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de paradas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-500" />
            Análisis de Tiempos de Parada (Hoy)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tiemposParada.map((parada, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded" style={{ opacity: 1 - (index * 0.15) }} />
                  <span className="font-medium">{parada.motivo}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{parada.tiempo}</span>
                  <span className="text-sm font-semibold">{parada.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Tendencias de Eficiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tendencias.map((tendencia, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{tendencia.periodo}</p>
                  <p className="text-sm text-gray-600">Eficiencia: {tendencia.eficiencia}%</p>
                </div>
                <div className="flex items-center space-x-2">
                  {tendencia.tipo === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-semibold ${
                    tendencia.tipo === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tendencia.cambio > 0 ? '+' : ''}{tendencia.cambio}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadisticasTab;