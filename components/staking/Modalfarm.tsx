// /components/ModalFarm.tsx

import React from "react";

interface ModalFarmProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode; // Añade esta línea
}
const ModalFarm: React.FC<ModalFarmProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-t from-white to-orange-300 text-white max-w-3xl max-h-[90vh] w-[95%] md:w-3/4 h-3/4 p-4 overflow-y-auto rounded-lg">
        <button onClick={onClose} className="float-right font-bold text-xl">
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalFarm;
