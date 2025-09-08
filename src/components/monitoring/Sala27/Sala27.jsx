import React, { useState } from 'react';
import Monolab from './machines/Monolab';
import Marquesini from './machines/Marquesini';
import Tecnomaco from './machines/Tecnomaco';
import Cremer from './machines/Cremer';
import EnvasadoraPolvo from './machines/EnvasadoraPolvo';
import Ensobradora2 from './machines/Ensobradora2';
import Ensobradora1 from './machines/Ensobradora1';
import Flashes from './machines/Flashes';
import Jarabes from './machines/Jarabes';
import VialesPitillo from './machines/VialesPitillo';
import Viales from './machines/Viales';
import Doypack from './machines/Doypack';
import CremerDetails from './machines/details/Cremer/CremerDetails';
import TecnomacoDetails from './machines/details/Tecnomaco/TecnomacoDetails';

const Sala27 = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    machineType: null,
    machineData: null
  });

  const openModal = (machineType, machineData) => {
    setModalState({
      isOpen: true,
      machineType,
      machineData
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      machineType: null,
      machineData: null
    });
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Monolab onOpenModal={(data) => openModal('monolab', data)} />
        <Marquesini onOpenModal={(data) => openModal('marquesini', data)} />
        <Tecnomaco onOpenModal={(data) => openModal('tecnomaco', data)} />
        <Cremer onOpenModal={(data) => openModal('cremer', data)} />
        <EnvasadoraPolvo onOpenModal={(data) => openModal('envasadoraPolvo', data)} />
        <Ensobradora2 onOpenModal={(data) => openModal('ensobradora2', data)} />
        <Ensobradora1 onOpenModal={(data) => openModal('ensobradora1', data)} />
        <Flashes onOpenModal={(data) => openModal('flashes', data)} />
        <Jarabes onOpenModal={(data) => openModal('jarabes', data)} />
        <VialesPitillo onOpenModal={(data) => openModal('vialesPitillo', data)} />
        <Viales onOpenModal={(data) => openModal('viales', data)} />
        <Doypack onOpenModal={(data) => openModal('doypack', data)} />
      </div>
      
      {/* Modales de detalles */}
  
      
      {modalState.machineType === 'cremer' && (
        <CremerDetails
          isOpen={modalState.isOpen}
          onClose={closeModal}
          machineData={modalState.machineData}
        />
      )}
      
      {modalState.machineType === 'tecnomaco' && (
        <TecnomacoDetails
          isOpen={modalState.isOpen}
          onClose={closeModal}
          machineData={modalState.machineData}
        />
      )}
    </div>
  );
};

export default Sala27;