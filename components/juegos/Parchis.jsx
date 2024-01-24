// import { useState } from 'react'

// const IndexPage = () => {
//   const [state, setState] = useState({
//     board: Array(15).fill(Array(15).fill(null)),
//     turn: 1,
//     dice: null,
//     spinning: false,
//   })

//   const handleDiceRoll = () => {
//     setState({ ...state, spinning: true })

//     setTimeout(() => {
//       const dice = Math.floor(Math.random() * 6) + 1
//       setState({
//         ...state,
//         dice,
//         spinning: false,
//       })
//     }, 1000)
//   }

//   const getColor = (i, j) => {
//     if (i >= 6 && i <= 8 && j >= 6 && j <= 8) return 'bg-gray-300'
//     if (i < 6 && j >= 6 && j <= 8) return 'bg-red-300'
//     if (i > 8 && j >= 6 && j <= 8) return 'bg-blue-300'
//     if (j < 6 && i >= 6 && i <= 8) return 'bg-green-300'
//     if (j > 8 && i >= 6 && i <= 8) return 'bg-yellow-300'
//     return 'bg-white'
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
//       <table className="border-collapse">
//         <tbody>
//           {state.board.map((row, i) => (
//             <tr key={i}>
//               {row.map((_, j) => (
//                 <td key={j} className={`border border-gray-600 w-12 h-12 text-center ${getColor(i, j)}`}>
//                   {/* Add your game logic here */}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="mt-4 flex items-center">
//         <button 
//           onClick={handleDiceRoll} 
//           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-200"
//         >
//           Lanzar los dados
//         </button>
//         <div className={`ml-4 w-8 h-8 bg-white rounded-full flex items-center justify-center ${state.spinning ? 'animate-spin' : ''}`}>
//           {state.dice}
//         </div>
//       </div>
//     </div>
//   );  
// }

// export default IndexPage


////////////////////////////////////////////////////////////////




// import React, { useEffect, useState } from 'react';
// import ParchisBoard from '../../components/juegos/bord'; // Asegúrate de que la ruta sea correcta

// const IndexPage = () => {
//   const [state, setState] = useState({
//     board: Array(15).fill(Array(15).fill(null)),
//     turn: 1,
//     dice: null as number | null, // Aquí especificamos que puede ser un número o null
//     spinning: false,
//   });

//   useEffect(() => {
//     setState(prevState => ({ ...prevState }));
//   }, []);
  

//   const handleDiceRoll = () => {
//     setState({ ...state, spinning: true });

//     setTimeout(() => {
//       const dice = Math.floor(Math.random() * 6) + 1;
//       setState({
//         ...state,
//         dice,
//         spinning: false,
//       });
//     }, 1000);
//   };

//   const handlePieceClick = (position: [number, number], value: any) => {
//     // Aquí va la lógica para manejar el clic en una pieza
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
//       <ParchisBoard board={state.board} handlePieceClick={handlePieceClick} />
//       <div className="mt-4 flex items-center">
//         <button
//           onClick={handleDiceRoll}
//           className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-200"
//         >
//           Lanzar los dados
//         </button>
//         <div className={`ml-4 w-8 h-8 bg-white rounded-full flex items-center justify-center ${state.spinning ? 'animate-spin' : ''}`}>
//           {state.dice}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndexPage;


import { useState } from 'react';
import Board from '../juegos/bord';
import Dice from '../juegos/dice';

const IndexPage = () => {
  const [state, setState] = useState({
    board: Array(15).fill(Array(15).fill(null)),
    turn: 1,
    dice: null,
    spinning: false,
  });

  const handleDiceRoll = () => {
    setState({ ...state, spinning: true });
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setState({
        ...state,
        dice,
        spinning: false,
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <Board board={state.board} />
      <div className="mt-4 flex items-center">
        <button 
          onClick={handleDiceRoll} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:border-blue-900 focus:ring focus:ring-blue-200"
        >
          Lanzar los dados
        </button>
        <Dice spinning={state.spinning} dice={state.dice} />
      </div>
    </div>
  );
};

export default IndexPage;
