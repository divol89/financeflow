import React, { useEffect, useState } from "react";
import Image from "next/image";

const format = (value, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return `$${n.toFixed(n < 0.001 ? 7 : 5)}`;
};

export default function ShimmerPrice() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let mounted = true;
    fetch("/api/prices")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data) setPrices(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const smr = prices.shimmer ?? prices.SMR ?? prices.smr;
  const miota = prices.miota ?? prices.MIOTA ?? prices.iota;

  return (
    <div className="flex items-center justify-center gap-5 text-white">
      <div className="flex items-center gap-2">
        <Image src="/img/SMR.svg" alt="smr.network" width={28} height={28} />
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">SMR</p>
          <p className="text-xs text-gray-300">{format(smr, "$0.0000991")}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Image src="/img/IOTA.svg" alt="miota.network" width={28} height={28} />
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">MIOTA</p>
          <p className="text-xs text-gray-300">{format(miota, "$0.04487527")}</p>
        </div>
      </div>
    </div>
  );
}
