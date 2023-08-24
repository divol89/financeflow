// /components/ModalFarm.tsx

import React from 'react';

interface ModalFarmProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode; // Añade esta línea

}
const ModalFarm: React.FC<ModalFarmProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-t from-white to-orange-300 text-white max-w-3xl max-h-[90vh] w-[95%] md:w-3/4 h-3/4 p-4 overflow-y-auto rounded-lg">
                <button onClick={onClose} className="float-right font-bold text-xl">x</button>
                {/* <h2 className="text-xl mb-0 font-bold colore">{title}</h2> */}
                {children}
            </div>
        </div>
    );
}

// const ModalFarm: React.FC<ModalFarmProps> = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white w-3/4 h-3/4 p-4 overflow-y-auto">
//                 <button onClick={onClose} className="float-right">x</button>
//                 <h2 className="text-xl mb-4">{title}</h2>
//                 {children}
//             </div>
//         </div>
//     );
// }

export default ModalFarm;
