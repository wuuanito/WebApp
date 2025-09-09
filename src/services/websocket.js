// Configuración del Cliente WebSocket
import { toast } from 'react-hot-toast';

class OrderWebSocketClient {
    constructor() {
        this.stompClient = null;
        this.orders = [];
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.callbacks = {
            onOrderUpdate: null,
            onOeeUpdate: null,
            onSystemNotification: null
        };
    }

    connect() {
        try {
            // Verificar si SockJS y Stomp están disponibles
            if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
                console.error('SockJS o Stomp no están disponibles. Asegúrate de incluir las librerías.');
                return;
            }

            // Conexión sin autenticación
            const socket = new SockJS('http://localhost:8020/ws');
            this.stompClient = Stomp.over(socket);
            
            // Configurar headers de conexión
            const connectHeaders = {};
            
            this.stompClient.connect(connectHeaders, (frame) => {
                console.log('Conectado a WebSocket:', frame);
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Suscribirse a notificaciones de órdenes
                this.stompClient.subscribe('/topic/orders', (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        this.handleOrderNotification(notification);
                    } catch (error) {
                        console.error('Error parsing order notification:', error);
                    }
                });
                
                // Suscribirse a métricas OEE
                this.stompClient.subscribe('/topic/oee', (message) => {
                    try {
                        const oeeData = JSON.parse(message.body);
                        this.handleOeeNotification(oeeData);
                    } catch (error) {
                        console.error('Error parsing OEE notification:', error);
                    }
                });
                
                // Suscribirse a notificaciones del sistema
                this.stompClient.subscribe('/topic/system', (message) => {
                    try {
                        const systemMsg = JSON.parse(message.body);
                        this.handleSystemNotification(systemMsg);
                    } catch (error) {
                        console.error('Error parsing system notification:', error);
                    }
                });
                
                toast.success('Conectado al servidor WebSocket');
            }, (error) => {
                console.error('Error de conexión WebSocket:', error);
                this.isConnected = false;
                this.handleConnectionError();
            });
            
        } catch (error) {
            console.error('Error al inicializar WebSocket:', error);
            this.handleConnectionError();
        }
    }

    handleConnectionError() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Intentando reconectar... Intento ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Máximo número de intentos de reconexión alcanzado');
            toast.error('No se pudo conectar al servidor WebSocket');
        }
    }

    handleOrderNotification(notification) {
        console.log('Notificación de orden:', notification);
        
        switch(notification.action) {
            case 'CREATED':
                this.addNewOrder(notification);
                break;
            case 'STATUS_CHANGED':
                this.updateOrderStatus(notification);
                break;
            case 'ORDER_STARTED':
                console.log('Orden iniciada:', notification);
                this.updateOrderUI(notification);
                this.showToast(`Orden ${notification.codOrden || notification.orderNumber} iniciada correctamente`, 'success');
                break;
            case 'ORDER_FINALIZED':
                console.log('Orden finalizada:', notification);
                this.updateOrderUI(notification);
                this.showToast(`Orden ${notification.codOrden || notification.orderNumber} finalizada`, 'success');
                break;
            case 'PAUSE_STARTED':
                console.log('Pausa iniciada:', notification);
                this.updatePauseUI(notification);
                this.showToast(`Pausa iniciada en orden ${notification.codOrden || notification.orderNumber}`, 'info');
                break;
            case 'PAUSE_FINISHED':
                console.log('Pausa finalizada:', notification);
                this.updatePauseUI(notification);
                this.showToast(`Pausa finalizada en orden ${notification.codOrden || notification.orderNumber}`, 'info');
                break;
            case 'STARTED':
                this.updateOrderStatus(notification);
                break;
            case 'FINALIZED':
                this.updateOrderStatus(notification);
                break;
            default:
                console.log('Acción de orden no reconocida:', notification.action);
        }
        
        // Llamar callback si está definido
        if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate(notification);
        }
    }

    addNewOrder(notification) {
        // Mostrar notificación al usuario
        this.showToast(`Nueva orden creada: ${notification.orderNumber || notification.codOrden}`, 'success');
        
        // Actualizar la lista de órdenes si hay callback
        if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate({
                type: 'NEW_ORDER',
                data: notification
            });
        }
    }

    updateOrderStatus(notification) {
        const message = notification.message || `Orden ${notification.orderNumber || notification.codOrden} actualizada`;
        this.showToast(message, 'info');
        
        // Notificar cambio de estado
        if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate({
                type: 'STATUS_UPDATE',
                data: notification
            });
        }
    }

    updateOrderUI(notification) {
        console.log('Actualizando UI de orden:', notification);
        
        // Notificar actualización de orden específica
        if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate({
                type: 'ORDER_UPDATE',
                action: notification.action,
                data: notification
            });
        }
    }

    updatePauseUI(notification) {
        console.log('Actualizando UI de pausa:', notification);
        
        // Notificar actualización de pausa
        if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate({
                type: 'PAUSE_UPDATE',
                action: notification.action,
                data: notification
            });
        }
    }

    handleOeeNotification(oeeData) {
        console.log('Métricas OEE actualizadas:', oeeData);
        
        // Llamar callback para actualizar dashboard de métricas
        if (this.callbacks.onOeeUpdate) {
            this.callbacks.onOeeUpdate(oeeData);
        }
    }

    handleSystemNotification(systemMsg) {
        console.log('Notificación del sistema:', systemMsg);
        this.showToast(systemMsg.message, systemMsg.level || 'info');
        
        // Llamar callback para notificaciones del sistema
        if (this.callbacks.onSystemNotification) {
            this.callbacks.onSystemNotification(systemMsg);
        }
    }

    showToast(message, type) {
        switch(type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
            default:
                toast(message);
                break;
        }
    }

    // Métodos para registrar callbacks
    onOrderUpdate(callback) {
        this.callbacks.onOrderUpdate = callback;
    }

    onOeeUpdate(callback) {
        this.callbacks.onOeeUpdate = callback;
    }

    onSystemNotification(callback) {
        this.callbacks.onSystemNotification = callback;
    }

    // Enviar mensaje al servidor
    sendMessage(destination, message) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.send(destination, {}, JSON.stringify(message));
        } else {
            console.error('WebSocket no está conectado');
            toast.error('No hay conexión con el servidor');
        }
    }

    disconnect() {
        if (this.stompClient && this.isConnected) {
            this.stompClient.disconnect(() => {
                console.log('Desconectado del WebSocket');
                this.isConnected = false;
            });
        }
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

// Instancia singleton del cliente WebSocket
const wsClient = new OrderWebSocketClient();

export default wsClient;

// Hook personalizado para React
export const useWebSocket = () => {
    return {
        client: wsClient,
        connect: () => wsClient.connect(),
        disconnect: () => wsClient.disconnect(),
        isConnected: wsClient.getConnectionStatus(),
        onOrderUpdate: (callback) => wsClient.onOrderUpdate(callback),
        onOeeUpdate: (callback) => wsClient.onOeeUpdate(callback),
        onSystemNotification: (callback) => wsClient.onSystemNotification(callback),
        sendMessage: (destination, message) => wsClient.sendMessage(destination, message)
    };
};