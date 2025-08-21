import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Activity } from 'lucide-react';

const MonitorizacionSystem = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-purple-600" />
          Monitorización del Sistema
        </h2>
        <p className="text-muted-foreground mt-2">
          Control y supervisión de procesos de producción en tiempo real.
        </p>
      </div>
     
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Líneas de Producción</CardTitle>
            <CardDescription>Estado actual de las líneas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8/10</div>
            <p className="text-xs text-muted-foreground">Líneas activas</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia Global</CardTitle>
            <CardDescription>OEE promedio del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% vs ayer</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Alertas Activas</CardTitle>
            <CardDescription>Notificaciones pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Temperatura Promedio</CardTitle>
            <CardDescription>Sensores de planta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23.5°C</div>
            <p className="text-xs text-muted-foreground">Rango óptimo</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Producción Diaria</CardTitle>
            <CardDescription>Unidades completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2,847</div>
            <p className="text-xs text-muted-foreground">95% del objetivo</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Tiempo de Inactividad</CardTitle>
            <CardDescription>Paradas no programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">1.2h</div>
            <p className="text-xs text-muted-foreground">Hoy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitorizacionSystem;