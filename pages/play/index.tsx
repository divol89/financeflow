// pages/index.tsx
import React from 'react';
import Parchis from '../../components/juegos/Parchis'; // Asume que tu componente de Parchís se llama 'Parchis' y está en la carpeta 'components'

const IndexPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4">Bienvenido al juego de Parchís</h1>
      <Parchis />
    </div>
  );
};

export default IndexPage;
