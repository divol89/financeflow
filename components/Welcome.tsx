import React from "react";
import Image from "next/image"; // Añadimos esta importación

const Welcome = () => {
  return (
    <div className="text-white flex flex-col items-center md:flex-row md:items-center md:justify-center p-4">
      <div className="mb-4 md:mb-0 md:mr-8 lg:mr-12">
        <Image
          src="/img/WAVES.png" // Asegúrate de que esta ruta sea correcta
          alt="WAVES"
          width={380} // Ajusta el tamaño según necesites
          height={380}
          className="mx-auto"
        />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-5xl text-white lg:ml-10 lg:text-5xl font-extrabold inline-block">
          Flow Finance
        </h1>
        <h6 className=" ml-1 lg:ml-12 mb-10 lg:text-1xl font-weight-200 text-white mt-2 block sparkle">
          <strong>E</strong>mpower your investments,
          <strong>v</strong>ote for success,
          <br />
          <strong>r</strong>eap the rewards.
        </h6>
        <p className="lg:ml-12 text-cyan-200 mt-4 italic">
          EVR system empowering the users.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
