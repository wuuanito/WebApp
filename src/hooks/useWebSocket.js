import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      ws.current = new WebSocket(url);
      setConnectionStatus('Connecting');

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('Connected');
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('Disconnected');
        
        // Intentar reconectar si no se ha alcanzado el máximo de intentos
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Reconnect attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000); // Reconectar después de 3 segundos
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('Error');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {
    data,
    connectionStatus,
    sendMessage
  };
};

export default useWebSocket;