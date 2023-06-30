// import React from "react";

// export default function ThirdwebGuideFooter() {
//   return (
//     <>
//       <div
//         style={{
//           position: "fixed",
//           bottom: -120,
//           right: -80,
//           height: 300,
//           width: 150,
//           border: "1px solid #eaeaea",
//           transform: "rotate(45deg)",
//           backgroundColor: " #262935",
//           cursor: "pointer",
//         }}
//         role="button"
//         onClick={() =>
//           window.open(
//             "https://github.com/thirdweb-example/token-drop",
//             "_blank"
//           )
//         }
//       />

//       <div
//         style={{
//           position: "fixed",
//           bottom: 14,
//           right: 18,
//         }}
//       >
//         <img
//           src="/github.png"
//           width={40}
//           height={40}
//           role="button"
//           style={{ cursor: "pointer" }}
//           onClick={() =>
//             window.open(
//               "https://github.com/thirdweb-example/token-drop",
//               "_blank"
//             )
//           }
//         />
//       </div>
//     </>
//   );
// }

import React from 'react';

function PresaleInstructions() {
    return (
        <div className='text-white'>
            <h1>¿Cómo comprar en la preventa?</h1>
            <ol>
                <li>Descarga e instala la billetera MetaMask en tu dispositivo.</li>
                <li>Configura tu billetera MetaMask para la red Avalanche. Puedes seguir esta <a href="https://docs.avax.network/build/tutorials/platform/configure-metamask-for-avalanche" target="_blank" rel="noreferrer">guía de configuración</a>.</li>
                <li>Compra Avalanche (AVAX) y deposita al menos 1 AVAX en tu billetera. Puedes comprar AVAX en cualquier exchange que lo liste y luego enviarlo a tu dirección de MetaMask.</li>
                <li>Visita nuestro sitio web durante el período de preventa.</li>
                <li>Conéctate a tu billetera MetaMask a través de nuestro sitio web.</li>
                <li>Entra en la página de preventa y elige cuántos tokens deseas comprar. No puedes comprar más de 1 AVAX por wallet.</li>
                <li>Confirma tu compra en la billetera MetaMask. Asegúrate de tener suficientes fondos para pagar el gas de la transacción.</li>
                <li>¡Eso es todo! Los tokens deberían aparecer en tu billetera una vez que la transacción se confirme en la blockchain.</li>
            </ol>
        </div>
    );
}

export default PresaleInstructions;