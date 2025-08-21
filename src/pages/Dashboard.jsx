import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import InformaticaDepartment from '../components/departments/Informatica/InformaticaDepartment';
import AdministracionDepartment from '../components/departments/Administracion/AdministracionDepartment';
import MonitorizacionSystem from '../components/monitoring/MonitorizacionSystem';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  LogOut, 
  Menu,
  Bell,
  Search,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Monitor,
  FileText,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showDepartments, setShowDepartments] = useState(false);

  // Control de acceso por departamento
  const hasAccessToDepartment = (department) => {
    if (user?.role === 'administrador') return true;
    return user?.department?.toLowerCase() === department.toLowerCase();
  };

  // Control de acceso para monitorización (solo producción y administrador)
  const hasAccessToMonitoring = () => {
    if (user?.role === 'administrador') return true;
    return user?.department?.toLowerCase() === 'produccion';
  };

  const availableDepartments = [
    { id: 'informatica', name: 'Informática', icon: Monitor },
    { id: 'administracion', name: 'Administración', icon: FileText }
  ].filter(dept => hasAccessToDepartment(dept.id));

  const stats = [
    {
      title: 'Ventas Totales',
      value: '$45,231.89',
      change: '+20.1%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Usuarios Activos',
      value: '2,350',
      change: '+180.1%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Pedidos',
      value: '12,234',
      change: '+19%',
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
    {
      title: 'Conversión',
      value: '3.2%',
      change: '+4.75%',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card transition-colors duration-300">
        <div className="flex h-16 items-center px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <img 
                src="https://www.riojanaturepharma.com/assets/favicon-32x32.png" 
                alt="Logo" 
                className="w-8 h-8"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Button 
              variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('dashboard')}
              className="text-sm"
            >
              Inicio
            </Button>
            
            {/* Departamentos Dropdown */}
            {availableDepartments.length > 0 && (
              <div className="relative">
                <Button 
                  variant="ghost"
                  onClick={() => setShowDepartments(!showDepartments)}
                  className="flex items-center space-x-1 text-sm"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Departamentos</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showDepartments ? 'rotate-180' : ''}`} />
                </Button>
                
                {showDepartments && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-card border rounded-md shadow-lg z-50">
                    {availableDepartments.map((dept) => {
                      const Icon = dept.icon;
                      return (
                        <Button
                          key={dept.id}
                          variant="ghost"
                          onClick={() => {
                            setActiveSection(dept.id);
                            setShowDepartments(false);
                          }}
                          className="w-full justify-start px-3 py-2 text-sm hover:bg-muted"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {dept.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Monitorización */}
            {hasAccessToMonitoring() && (
              <Button 
                variant={activeSection === 'monitorizacion' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('monitorizacion')}
                className="flex items-center space-x-1 text-sm"
              >
                <Activity className="h-4 w-4" />
                <span>Captura Maquinas</span>
              </Button>
            )}
          </nav>
          
          <div className="ml-auto flex items-center space-x-4">
            
            
         
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="transition-transform hover:scale-110"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.jobTitle} - {user?.department}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        {activeSection === 'dashboard' && (
          <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">¡Bienvenido de vuelta, {user?.name}!</h2>
          <p className="text-muted-foreground mt-2">
            Aquí tienes un resumen de tu actividad reciente.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Nuevo usuario registrado', time: 'Hace 2 minutos', user: 'Juan Pérez' },
                  { action: 'Pedido completado', time: 'Hace 5 minutos', user: 'María García' },
                  { action: 'Producto actualizado', time: 'Hace 10 minutos', user: 'Admin' },
                  { action: 'Nueva venta realizada', time: 'Hace 15 minutos', user: 'Carlos López' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Tareas frecuentes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gestionar Usuarios
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ver Pedidos
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </CardContent>
          </Card>
        </div>
          </div>
        )}
        
        {activeSection === 'informatica' && <InformaticaDepartment />}
        
        {activeSection === 'administracion' && <AdministracionDepartment />}
         
         {activeSection === 'monitorizacion' && <MonitorizacionSystem />}
      </main>
    </div>
  );
};

export default Dashboard;