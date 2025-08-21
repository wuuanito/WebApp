import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { FileText } from 'lucide-react';

const AdministracionDepartment = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-green-600" />
          Departamento de Administración
        </h2>
        <p className="text-muted-foreground mt-2">
          Gestión administrativa, recursos humanos y finanzas.
        </p>
      </div>
     
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Empleados Activos</CardTitle>
            <CardDescription>Personal en nómina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-xs text-muted-foreground">+3 este mes</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Presupuesto Mensual</CardTitle>
            <CardDescription>Gastos operativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€45,230</div>
            <p className="text-xs text-muted-foreground">85% utilizado</p>
          </CardContent>
        </Card>
       
        <Card>
          <CardHeader>
            <CardTitle>Documentos Pendientes</CardTitle>
            <CardDescription>Requieren revisión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">Para esta semana</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdministracionDepartment;