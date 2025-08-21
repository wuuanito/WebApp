import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

const Softgel = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Máquinas Encapsuladoras</CardTitle>
          <CardDescription>Estado de equipos Softgel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">6/8</div>
          <p className="text-xs text-muted-foreground">Máquinas activas</p>
        </CardContent>
      </Card>
     
      <Card>
        <CardHeader>
          <CardTitle>Velocidad Producción</CardTitle>
          <CardDescription>Cápsulas por minuto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">850</div>
          <p className="text-xs text-muted-foreground">cpm promedio</p>
        </CardContent>
      </Card>
     
      <Card>
        <CardHeader>
          <CardTitle>Humedad Relativa</CardTitle>
          <CardDescription>Control ambiental</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">45%</div>
          <p className="text-xs text-muted-foreground">Nivel óptimo</p>
        </CardContent>
      </Card>
     
      <Card>
        <CardHeader>
          <CardTitle>Cápsulas Producidas</CardTitle>
          <CardDescription>Total del turno</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">125,400</div>
          <p className="text-xs text-muted-foreground">97% del objetivo</p>
        </CardContent>
      </Card>
     
      <Card>
        <CardHeader>
          <CardTitle>Rechazos</CardTitle>
          <CardDescription>Control de calidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">0.8%</div>
          <p className="text-xs text-muted-foreground">Dentro del rango</p>
        </CardContent>
      </Card>
     
      <Card>
        <CardHeader>
          <CardTitle>Tiempo Ciclo</CardTitle>
          <CardDescription>Promedio por lote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">2.3h</div>
          <p className="text-xs text-muted-foreground">Tiempo estándar</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Softgel;