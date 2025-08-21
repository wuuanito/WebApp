import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Monitor } from 'lucide-react';

const InformaticaDepartment = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Monitor className="h-8 w-8 text-blue-600" />
          Departamento de Informática
        </h2>
        <p className="text-muted-foreground mt-2">
          Gestión de sistemas, infraestructura y soporte técnico.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sistemas Activos</CardTitle>
            <CardDescription>Estado de los servidores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">Uptime del sistema</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tickets Abiertos</CardTitle>
            <CardDescription>Soporte técnico pendiente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actualizaciones</CardTitle>
            <CardDescription>Software pendiente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-xs text-muted-foreground">Programadas para hoy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InformaticaDepartment;