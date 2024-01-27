import React, { useState } from "react";
import { db } from "../firebase/firebase";

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await db.collection("tokens").add({
        name,
        address,
        logo,
        poolAddress,
      });

      // reset form after submission
      setName("");
      setAddress("");
      setLogo("");
      setPoolAddress("");

      alert("Document successfully created!");
    } catch (error) {
      console.error("Error creating document: ", error);
    }
  };

  return (
    <form className="space-y-4 block lg:block" onSubmit={handleSubmit}>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Token Name"
        required
      />
      <input
        className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Token Contract"
        required
      />
      <input
        className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4"
        type="url"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        placeholder="Logo URL"
        required
      />
      <input
        className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-4"
        type="text"
        value={poolAddress}
        onChange={(e) => setPoolAddress(e.target.value)}
        placeholder="Token Pool Address"
        required
      />
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Done
        </button>
      </div>
    </form>
  );
};

export default AdminLogin;
