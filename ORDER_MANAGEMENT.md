# Gestión de Órdenes - Funcionalidades de Inicio y Pausa

## Descripción General

Se han implementado nuevas funcionalidades para la gestión de órdenes de producción, permitiendo iniciar y pausar órdenes directamente desde la interfaz de administración.

## Funcionalidades Implementadas

### 1. Iniciar Orden

**Endpoint:** `PUT /order/{orderId}/start`

**Características:**
- Permite iniciar una orden de producción que esté en estado pendiente
- El botón "Iniciar" solo aparece para órdenes que no están en proceso o finalizadas
- Muestra feedback visual durante la operación ("Iniciando...")
- Actualiza automáticamente la lista de órdenes tras la operación
- Integrado con el sistema de notificaciones toast

**Uso:**
```javascript
// Función implementada en AdministracionOrdenes.jsx
const handleStartOrder = async (orderId) => {
  await apiService.startOrder(orderId);
  // Actualiza la UI y muestra notificación
};
```

### 2. Pausar Orden

**Endpoint:** `POST /pause/start`

**Características:**
- Permite pausar una orden que esté en proceso
- Modal interactivo para capturar información de la pausa:
  - Tipo de pausa (mantenimiento, cambio de formato, falta de material, avería, descanso, otros)
  - Descripción detallada del motivo
  - Usuario que realiza la pausa
- Validación de campos requeridos
- El botón "Pausar" solo aparece para órdenes en estado "EN_PROCESO"

**Tipos de Pausa Disponibles:**
- `mantenimiento`: Mantenimiento preventivo o correctivo
- `cambio_formato`: Cambio de configuración de producción
- `falta_material`: Falta de materias primas o insumos
- `averia`: Falla técnica o avería de equipos
- `descanso`: Pausas programadas del personal
- `otros`: Otros motivos no categorizados

### 3. Funcionalidad de Testing

**Endpoint:** `PUT /order/{orderId}/test-start`

**Características:**
- Permite iniciar una orden con una hora específica para propósitos de testing
- Útil para simulaciones y pruebas del sistema

```javascript
// Ejemplo de uso para testing
await apiService.testStartOrder(orderId, "2024-01-15T08:00:00");
```

## Integración con el Sistema

### Servicio API

Todos los métodos están implementados en `src/services/api.js`:

- `startOrder(orderId)`: Inicia una orden normal
- `testStartOrder(orderId, horaInicio)`: Inicia una orden con hora específica
- `pauseOrder(codOrden, tipoPausa, descripcion, usuario, computa)`: Pausa una orden

### Interfaz de Usuario

**Ubicación:** `src/components/monitoring/Administracion/AdministracionOrdenes.jsx`

**Elementos UI:**
- Botones de acción en la tabla de órdenes
- Modal de pausa con formulario completo
- Estados de carga y feedback visual
- Notificaciones toast para éxito y errores

### Estados de Órdenes

La lógica de botones se basa en el estado de la orden:

- **Pendiente/Creada**: Muestra botón "Iniciar"
- **EN_PROCESO**: Muestra botón "Pausar"
- **FINALIZADA**: No muestra botones de acción

## WebSocket Integration

Las operaciones están integradas con el sistema WebSocket existente:

- Las actualizaciones de estado se propagan automáticamente
- La lista de órdenes se actualiza en tiempo real
- Notificaciones push para cambios de estado

## Manejo de Errores

- Validación de campos requeridos en el frontend
- Manejo de errores de red y servidor
- Mensajes de error descriptivos para el usuario
- Estados de carga para prevenir múltiples envíos

## Seguridad

- Validación de permisos en el backend
- Sanitización de datos de entrada
- Logs de auditoría para todas las operaciones

## Ejemplos de Uso

### Iniciar una Orden

1. Navegar a "Administración de Órdenes"
2. Localizar la orden deseada en la tabla
3. Hacer clic en el botón "Iniciar" (verde)
4. Confirmar la operación en la notificación

### Pausar una Orden

1. Localizar una orden en estado "EN_PROCESO"
2. Hacer clic en el botón "Pausar" (naranja)
3. Completar el formulario del modal:
   - Seleccionar tipo de pausa
   - Escribir descripción detallada
   - Ingresar nombre de usuario
4. Hacer clic en "Pausar Orden"
5. Confirmar la operación en la notificación

## Consideraciones Técnicas

- **Performance**: Las operaciones son asíncronas y no bloquean la UI
- **Consistencia**: Actualización automática de datos tras operaciones
- **UX**: Feedback visual inmediato y estados de carga
- **Escalabilidad**: Arquitectura preparada para futuras funcionalidades

## Próximas Mejoras

- Reanudar órdenes pausadas
- Finalizar órdenes manualmente
- Historial detallado de cambios de estado
- Reportes de pausas y tiempos de producción
- Notificaciones por email para eventos críticos