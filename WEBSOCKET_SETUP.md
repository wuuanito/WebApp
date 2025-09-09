# Configuración del Cliente WebSocket

## Descripción
Este sistema implementa un cliente WebSocket para recibir notificaciones en tiempo real sobre órdenes, métricas OEE y notificaciones del sistema.

## Características Implementadas

### 1. Librerías Incluidas
- **SockJS**: Cliente WebSocket compatible con navegadores
- **Stomp.js**: Protocolo de mensajería sobre WebSocket
- **React Hot Toast**: Sistema de notificaciones

### 2. Funcionalidades del Cliente WebSocket

#### Conexión Automática
- Se conecta automáticamente al servidor `http://localhost:8020/ws`
- Reconexión automática en caso de pérdida de conexión
- Máximo 5 intentos de reconexión con delay incremental

#### Suscripciones
- **`/topic/orders`**: Notificaciones de órdenes (creación, cambios de estado)
- **`/topic/oee`**: Actualizaciones de métricas OEE en tiempo real
- **`/topic/system`**: Notificaciones del sistema

#### Tipos de Notificaciones de Órdenes
- `CREATED`: Nueva orden creada
- `STATUS_CHANGED`: Cambio de estado de orden
- `STARTED`: Orden iniciada
- `FINALIZED`: Orden finalizada

### 3. Integración con React

#### Hook Personalizado
```javascript
import { useWebSocket } from '../services/websocket';

const { client, connect, disconnect, isConnected } = useWebSocket();
```

#### Callbacks Disponibles
```javascript
// Actualizaciones de órdenes
wsClient.onOrderUpdate((notification) => {
  // Manejar notificación de orden
});

// Actualizaciones de métricas OEE
wsClient.onOeeUpdate((oeeData) => {
  // Actualizar dashboard de métricas
});

// Notificaciones del sistema
wsClient.onSystemNotification((systemMsg) => {
  // Manejar notificación del sistema
});
```

### 4. Sistema de Notificaciones

#### Toast Notifications
- **Éxito**: Órdenes creadas exitosamente
- **Error**: Errores de conexión o API
- **Info**: Actualizaciones de estado
- **Sistema**: Notificaciones del servidor

#### Configuración de Toast
- Posición: Top-right
- Duración: 4 segundos (éxito: 3 segundos)
- Estilo: Fondo oscuro con texto blanco

### 5. Funcionalidades en AdministracionOrdenes

#### Actualizaciones Automáticas
- Lista de órdenes se actualiza automáticamente
- No requiere refrescar manualmente
- Notificaciones visuales para nuevas órdenes

#### Creación de Órdenes
- Formulario mejorado con validación
- Notificaciones de éxito/error
- Limpieza automática del formulario
- Actualización inmediata de la lista

### 6. Manejo de Errores

#### Conexión WebSocket
- Detección automática de desconexión
- Intentos de reconexión automática
- Notificaciones de estado de conexión

#### API Errors
- Manejo de errores HTTP
- Mensajes de error específicos
- Fallback a mensajes genéricos

## Uso del Sistema

### Inicialización
El sistema se inicializa automáticamente cuando se carga el componente `AdministracionOrdenes`.

### Flujo de Trabajo
1. **Conexión**: Se establece automáticamente al cargar la página
2. **Suscripciones**: Se configuran los topics de interés
3. **Callbacks**: Se registran los manejadores de eventos
4. **Notificaciones**: Se muestran automáticamente al usuario
5. **Cleanup**: Se desconecta al cerrar la página

### Estructura de Mensajes

#### Notificación de Orden
```json
{
  "action": "CREATED|STATUS_CHANGED|STARTED|FINALIZED",
  "orderId": 123,
  "orderNumber": "ORD-001",
  "codOrden": "12345",
  "newStatus": "EN_PROCESO",
  "message": "Orden iniciada exitosamente"
}
```

#### Métricas OEE
```json
{
  "orderId": 123,
  "disponibilidad": 95.5,
  "rendimiento": 87.2,
  "calidad": 99.1,
  "oee": 82.8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Notificación del Sistema
```json
{
  "message": "Sistema actualizado exitosamente",
  "level": "info|success|error|warning",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Configuración del Servidor

Para que el sistema funcione correctamente, el servidor backend debe:

1. **Exponer endpoint WebSocket**: `http://localhost:8020/ws`
2. **Configurar topics STOMP**:
   - `/topic/orders`
   - `/topic/oee`
   - `/topic/system`
3. **Enviar mensajes** en el formato especificado
4. **Permitir conexiones sin autenticación** (configurable)

## Beneficios

- **Tiempo Real**: Actualizaciones instantáneas sin polling
- **Eficiencia**: Menor carga en el servidor
- **UX Mejorada**: Notificaciones inmediatas al usuario
- **Escalabilidad**: Soporte para múltiples clientes
- **Robustez**: Reconexión automática y manejo de errores

## Próximas Mejoras

- Autenticación WebSocket
- Filtros de suscripción por usuario/máquina
- Persistencia de notificaciones
- Dashboard de métricas en tiempo real
- Notificaciones push del navegador