# Gestión Completa de Órdenes - Documentación

## Resumen
Se han implementado todas las funcionalidades para la gestión completa del ciclo de vida de las órdenes de producción, incluyendo iniciar, pausar, reanudar y finalizar órdenes.

## Funcionalidades Implementadas

### 1. Iniciar Orden
- **Endpoint:** `PUT /order/{orderId}/start`
- **Función:** `startOrder(orderId)`
- **Función de Prueba:** `testStartOrder(orderId)`
- **Descripción:** Inicia una orden de producción que está en estado pendiente

### 2. Pausar Orden
- **Endpoint:** `POST /pause/start`
- **Función:** `pauseOrder(codOrden, tipoPausa, descripcion, usuario, computa)`
- **Tipos de Pausa:** mantenimiento, cambio_formato, falta_material, averia, descanso, otros
- **Descripción:** Pausa una orden en proceso con motivo y descripción

### 3. Reanudar Orden
- **Endpoint:** `PUT /pause/order/{codOrden}/finish-active`
- **Función:** `resumeOrder(codOrden, descripcionFinal, usuario)`
- **Descripción:** Reanuda una orden que está pausada, finalizando la pausa activa

### 4. Finalizar Orden
- **Endpoint:** `PUT /order/{orderId}/finalize`
- **Función:** `finalizeOrder(orderId, botesBuenos, botesMalos, acumula)`
- **Descripción:** Finaliza una orden registrando la producción final

## Archivos Modificados

### 1. `src/services/api.js`
- ✅ Agregadas funciones `resumeOrder()` y `finalizeOrder()`
- ✅ Manejo completo de errores y logging
- ✅ Documentación JSDoc para todas las funciones

### 2. `src/components/monitoring/Administracion/AdministracionOrdenes.jsx`
- ✅ Nuevos estados para modales de reanudar y finalizar
- ✅ Funciones de manejo para reanudar y finalizar órdenes
- ✅ Botones condicionales según el estado de la orden
- ✅ Modales interactivos para reanudar y finalizar
- ✅ Validación de formularios y manejo de errores

## Interfaz de Usuario

### Botones de Acción
Los botones se muestran condicionalmente según el estado de cada orden:

1. **Ver Detalle:** Siempre disponible
2. **Iniciar:** Solo para órdenes no iniciadas
3. **Pausar:** Solo para órdenes en proceso (no pausadas)
4. **Reanudar:** Solo para órdenes pausadas
5. **Finalizar:** Solo para órdenes en proceso (no pausadas)

### Modales Implementados

#### Modal de Reanudar Orden
- Campo de descripción final (opcional)
- Campo de usuario (requerido)
- Validación de campos obligatorios
- Estados de carga durante la operación

#### Modal de Finalizar Orden
- Campo de botes buenos (requerido)
- Campo de botes malos (requerido)
- Checkbox para acumular producción
- Validación numérica y campos obligatorios

## Flujo de Estados

```
PENDIENTE → [Iniciar] → EN_PROCESO
                           ↓
                      [Pausar] ↔ [Reanudar]
                           ↓
                      [Finalizar] → FINALIZADA
```

## Características Técnicas

### Manejo de Estados
- Estados de carga individuales por orden
- Prevención de múltiples acciones simultáneas
- Actualización automática de la lista tras operaciones

### Notificaciones
- Toast notifications para éxito y errores
- Mensajes descriptivos para cada operación
- Integración con el sistema de notificaciones existente

### Validación
- Validación de campos obligatorios
- Validación de tipos de datos (números para producción)
- Prevención de acciones en estados incorrectos

### Seguridad
- Validación en frontend antes de envío
- Manejo seguro de errores del backend
- No exposición de información sensible

## Integración con WebSocket
Todas las operaciones están preparadas para recibir notificaciones en tiempo real del backend a través del sistema WebSocket implementado.

## Ejemplos de Uso

### Reanudar una Orden
```javascript
// Llamada directa a la API
await apiService.resumeOrder(1001, "Mantenimiento completado", "OPERADOR1");
```

### Finalizar una Orden
```javascript
// Llamada directa a la API
await apiService.finalizeOrder(123, 950, 50, true);
```

## Beneficios

1. **Gestión Completa:** Control total del ciclo de vida de órdenes
2. **Interfaz Intuitiva:** Botones contextuales según el estado
3. **Validación Robusta:** Prevención de errores y estados inconsistentes
4. **Experiencia de Usuario:** Feedback inmediato y estados de carga
5. **Escalabilidad:** Arquitectura preparada para futuras funcionalidades

## Próximas Mejoras

1. **Historial de Cambios:** Registro de todas las transiciones de estado
2. **Reportes:** Generación de reportes de producción y pausas
3. **Notificaciones Avanzadas:** Alertas automáticas por tiempo de pausa
4. **Permisos:** Control de acceso por roles de usuario
5. **Métricas:** Dashboard de KPIs de producción en tiempo real