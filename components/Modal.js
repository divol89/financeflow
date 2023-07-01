
////////////////////////////////////////////////////////////////////////////
import React from 'react';

const Modal = ({ showModal, closeModal, children }) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="p-2 fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="bg-yellow-500 shadow-md  px-8 pt-6 mb-4 lg:w-1/2 mt-0 mx-auto rounded  z-50 overflow-y-auto">
        <div className="py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-xl lg:text-3xl mb-4 text-center pt-2 mt-2 text-white font-bold">Add token&apos;s data.</p>
            <div className="cursor-pointer z-50" onClick={closeModal}>
              <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M11.41 9l5.29-5.29a1 1 0 0 0-1.41-1.41L10 7.59l-5.29-5.3a1 1 0 1 0-1.42 1.42l5.3 5.29-5.3 5.29a1 1 0 0 0 1.42 1.42l5.29-5.3 5.29 5.3a1 1 0 0 0 1.42-1.42L11.41 9z"></path>
              </svg>
            </div>
          </div>
          <div className="mb-4 flex flex-col p-4 space-y-4 lg:flex-col lg:space-y-4">
          </div>
          <div >
                      {children}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;

// className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"