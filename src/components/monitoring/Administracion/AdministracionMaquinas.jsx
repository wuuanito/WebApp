import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, X, Settings, Cpu } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8020';

const AdministracionMaquinas = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    machineName: '',
    standardTeorico: ''
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineConfig, setMachineConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [showAddPulseModal, setShowAddPulseModal] = useState(false);
  const [pulseFormData, setPulseFormData] = useState({
    pulseTypeName: '',
    gpioPin: '',
    displayOrder: '',
    description: '',
    isEnabled: true
  });
  
  // Edit machine states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [editFormData, setEditFormData] = useState({
    machineName: '',
    standardTeorico: ''
  });
  
  // Delete confirmation states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMachine, setDeletingMachine] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/machines`);
      if (!response.ok) {
        throw new Error('Error al cargar las máquinas');
      }
      const data = await response.json();
      setMachines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const response = await fetch(`${API_BASE_URL}/machines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machineName: formData.machineName,
          standardTeorico: parseFloat(formData.standardTeorico)
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la máquina');
      }
      
      // Refresh the machines list
      await fetchMachines();
      
      // Reset form and close modal
      setFormData({ machineName: '', standardTeorico: '' });
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({ machineName: '', standardTeorico: '' });
    setError(null);
  };

  const handleConfigureMachine = async (machine) => {
    setSelectedMachine(machine);
    setShowConfigModal(true);
    await fetchMachineConfig(machine.idMachine);
  };

  const fetchMachineConfig = async (machineId) => {
    try {
      setConfigLoading(true);
      const response = await fetch(`${API_BASE_URL}/machine-pulse-config/machine/${machineId}/configured`);
      if (!response.ok) {
        throw new Error('Error al cargar la configuración de la máquina');
      }
      const data = await response.json();
      setMachineConfig(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleAddPulseConfig = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const response = await fetch(`${API_BASE_URL}/machine-pulse-config/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idMachine: selectedMachine.idMachine,
          pulseTypeName: pulseFormData.pulseTypeName,
          gpioPin: parseInt(pulseFormData.gpioPin),
          displayOrder: parseInt(pulseFormData.displayOrder),
          description: pulseFormData.description,
          isEnabled: pulseFormData.isEnabled,
          createdBy: 'ADMIN'
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al configurar el pulso GPIO');
      }
      
      // Refresh machine config
      await fetchMachineConfig(selectedMachine.idMachine);
      
      // Reset form and close modal
      setPulseFormData({
        pulseTypeName: '',
        gpioPin: '',
        displayOrder: '',
        description: '',
        isEnabled: true
      });
      setShowAddPulseModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePulseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPulseFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Edit machine handlers
  const handleEditMachine = (machine) => {
    setEditingMachine(machine);
    setEditFormData({
      machineName: machine.machineName,
      standardTeorico: machine.standardTeorico.toString()
    });
    setShowEditModal(true);
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateMachine = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/machines/${editingMachine.idMachine}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machineName: editFormData.machineName,
          standardTeorico: parseFloat(editFormData.standardTeorico)
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar la máquina');
      }
      
      await fetchMachines();
      setShowEditModal(false);
      setEditingMachine(null);
      setEditFormData({ machineName: '', standardTeorico: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };
  
  // Delete machine handlers
  const handleDeleteMachine = (machine) => {
    setDeletingMachine(machine);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteMachine = async () => {
    setDeleteLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/machines/${deletingMachine.idMachine}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la máquina');
      }
      
      await fetchMachines();
      setShowDeleteModal(false);
      setDeletingMachine(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
    setSelectedMachine(null);
    setMachineConfig(null);
    setShowAddPulseModal(false);
    setPulseFormData({
      pulseTypeName: '',
      gpioPin: '',
      displayOrder: '',
      description: '',
      isEnabled: true
    });
    setError(null);
  };

  const filteredMachines = machines.filter(machine =>
    machine.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Máquinas</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Máquina
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar máquinas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Machines Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de Máquina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estándar Teórico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron máquinas que coincidan con la búsqueda' : 'No hay máquinas registradas'}
                  </td>
                </tr>
              ) : (
                filteredMachines.map((machine) => (
                  <tr key={machine.idMachine} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {machine.idMachine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {machine.machineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {machine.standardTeorico.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(machine.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(machine.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleConfigureMachine(machine)}
                          className="text-green-600 hover:text-green-900"
                          title="Configurar GPIO"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditMachine(machine)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar máquina"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMachine(machine)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar máquina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-blue-800">
            Total de máquinas: {machines.length} | Mostrando: {filteredMachines.length}
          </span>
        </div>
      </div>

      {/* Create Machine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Crear Nueva Máquina</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleCreateMachine} className="space-y-4">
              <div>
                <label htmlFor="machineName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Máquina
                </label>
                <input
                  type="text"
                  id="machineName"
                  name="machineName"
                  value={formData.machineName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el nombre de la máquina"
                />
              </div>
              
              <div>
                <label htmlFor="standardTeorico" className="block text-sm font-medium text-gray-700 mb-1">
                  Estándar Teórico
                </label>
                <input
                  type="number"
                  id="standardTeorico"
                  name="standardTeorico"
                  value={formData.standardTeorico}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el estándar teórico"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Máquina'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Machine Configuration Modal */}
      {showConfigModal && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Configuración GPIO</h2>
                  <p className="text-sm text-gray-600">{selectedMachine.machineName}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseConfigModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}
            
            {configLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : machineConfig ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-blue-800">
                        Total configurados: {machineConfig.totalConfiguredPulses} | Activos: {machineConfig.activePulses}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowAddPulseModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Pulso
                    </button>
                  </div>
                </div>
                
                {/* Configured Pulses */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Pulsos Configurados</h3>
                  </div>
                  
                  {machineConfig.configuredPulses.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No hay pulsos configurados para esta máquina
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo de Pulso
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              GPIO Pin
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Orden
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Descripción
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Activo
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {machineConfig.configuredPulses.map((pulse, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {pulse.pulseTypeName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                GPIO {pulse.gpioPin}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {pulse.displayOrder}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {pulse.description}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  pulse.isEnabled 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {pulse.isEnabled ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  pulse.active 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {pulse.active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add Pulse Configuration Modal */}
      {showAddPulseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Agregar Configuración de Pulso</h3>
              <button 
                onClick={() => setShowAddPulseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPulseConfig} className="space-y-4">
              <div>
                <label htmlFor="pulseTypeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Pulso
                </label>
                <input
                  type="text"
                  id="pulseTypeName"
                  name="pulseTypeName"
                  value={pulseFormData.pulseTypeName}
                  onChange={handlePulseInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ej: contador, sensor"
                />
              </div>
              
              <div>
                <label htmlFor="gpioPin" className="block text-sm font-medium text-gray-700 mb-1">
                  GPIO Pin
                </label>
                <input
                  type="number"
                  id="gpioPin"
                  name="gpioPin"
                  value={pulseFormData.gpioPin}
                  onChange={handlePulseInputChange}
                  min="1"
                  max="40"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ej: 18"
                />
              </div>
              
              <div>
                <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  name="displayOrder"
                  value={pulseFormData.displayOrder}
                  onChange={handlePulseInputChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ej: 1"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={pulseFormData.description}
                  onChange={handlePulseInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del pulso"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEnabled"
                  name="isEnabled"
                  checked={pulseFormData.isEnabled}
                  onChange={handlePulseInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-700">
                  Habilitado
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPulseModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Configurando...
                    </>
                  ) : (
                    'Agregar Configuración'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {showEditModal && editingMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Editar Máquina</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleUpdateMachine} className="space-y-4">
              <div>
                <label htmlFor="editMachineName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Máquina
                </label>
                <input
                  type="text"
                  id="editMachineName"
                  name="machineName"
                  value={editFormData.machineName}
                  onChange={handleEditInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el nombre de la máquina"
                />
              </div>
              
              <div>
                <label htmlFor="editStandardTeorico" className="block text-sm font-medium text-gray-700 mb-1">
                  Estándar Teórico
                </label>
                <input
                  type="number"
                  id="editStandardTeorico"
                  name="standardTeorico"
                  value={editFormData.standardTeorico}
                  onChange={handleEditInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el estándar teórico"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Máquina'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-gray-700">
                ¿Está seguro que desea eliminar la máquina <strong>{deletingMachine.machineName}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMachine}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Máquina'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministracionMaquinas;