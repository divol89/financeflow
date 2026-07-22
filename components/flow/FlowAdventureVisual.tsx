import Image from "next/image";
import { Compass, Flame, Search } from "lucide-react";
import { FLOW_FINANCE_IMAGE_PATH } from "@/lib/flowFinance/brand";

export function FlowAdventureVisual() {
  return (
    <div className="flow-hero-visual" aria-label="Flow-Finance Adventures exploration mark">
      <div className="flow-hero-image">
        <Image
          src={FLOW_FINANCE_IMAGE_PATH}
          alt="Flow-Finance Adventures abstract path and compass logo"
          fill
          priority
          sizes="(max-width: 767px) 82vw, 42vw"
        />
      </div>
      <div className="flow-hero-signal is-inspect"><Search className="h-4 w-4" /><span>Inspect</span></div>
      <div className="flow-hero-signal is-burn"><Flame className="h-4 w-4" /><span>Burn</span></div>
      <div className="flow-hero-signal is-build"><Compass className="h-4 w-4" /><span>Build</span></div>
    </div>
  );
}
