import React from 'react';

const Semaforo = ({ gpioStates, connectionStatus }) => {
  // Estados de los pines GPIO: 4 (verde), 27 (naranja), 21 (rojo)
  const getColorClass = (pin, state) => {
    const colors = {
      4: state ? 'bg-green-500 shadow-green-400' : 'bg-gray-300 opacity-30',
      27: state ? 'bg-orange-500 shadow-orange-400' : 'bg-gray-300 opacity-30',
      21: state ? 'bg-red-500 shadow-red-400' : 'bg-gray-300 opacity-30'
    };
    return colors[pin] || 'bg-gray-300 opacity-30';
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Luz Roja (GPIO 21) */}
      <div 
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
          getColorClass(21, gpioStates?.[21])
        } ${gpioStates?.[21] ? 'shadow-lg' : ''}`}
      />
      
      {/* Luz Naranja (GPIO 27) */}
      <div 
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
          getColorClass(27, gpioStates?.[27])
        } ${gpioStates?.[27] ? 'shadow-lg' : ''}`}
      />
      
      {/* Luz Verde (GPIO 4) */}
      <div 
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
          getColorClass(4, gpioStates?.[4])
        } ${gpioStates?.[4] ? 'shadow-lg' : ''}`}
      />
    </div>
  );
};

export default Semaforo;