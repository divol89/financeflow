// import React from 'react';

// interface ParchisBoardProps {
//   board: any[][];
//   handlePieceClick: (position: [number, number], value: any) => void;
// }

// const ParchisBoard: React.FC<ParchisBoardProps> = ({ board, handlePieceClick }) => {
//   const getColor = (i: number, j: number) => {
//     if (i >= 6 && i <= 8 && j >= 6 && j <= 8) return "bg-gray-300";
//     if (i < 6 && j >= 6 && j <= 8) return "bg-red-300";
//     if (i > 8 && j >= 6 && j <= 8) return "bg-blue-300";
//     if (j < 6 && i >= 6 && i <= 8) return "bg-green-300";
//     if (j > 8 && i >= 6 && i <= 8) return "bg-yellow-300";
//     return "bg-white";
//   };

//   return (
//     <table className="border-collapse">
//       {board.map((row, i) => (
//         <tr key={i}>
//           {row.map((cell, j) => (
//             <td key={j} className={`border border-gray-600 w-12 h-12 text-center ${getColor(i, j)}`}>
//               {cell}
//             </td>
//           ))}
//         </tr>
//       ))}
//     </table>
//   );
// };

// export default ParchisBoard;

const Board = ({ board }) => {
  const getColor = (i, j) => {
    if (i >= 6 && i <= 8 && j >= 6 && j <= 8) return "bg-gray-300";
    if (i < 6 && j >= 6 && j <= 8) return "bg-red-300";
    if (i > 8 && j >= 6 && j <= 8) return "bg-blue-300";
    if (j < 6 && i >= 6 && i <= 8) return "bg-green-300";
    if (j > 8 && i >= 6 && i <= 8) return "bg-yellow-300";
    return "bg-white";
  };

  return (
    <table className="border-collapse">
      <tbody>
        {board.map((row, i) => (
          <tr key={i}>
            {row.map((_, j) => (
              <td
                key={j}
                className={`border border-gray-600 w-12 h-12 text-center ${getColor(i, j)}`}
              >
                {/* Aquí irá la lógica de las fichas */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
