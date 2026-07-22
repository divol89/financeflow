import Link from "next/link";
import { Flame } from "lucide-react";

export function CommunityBurnBanner() {
  return (
    <Link href="/burn" className="levi-burn-fab" aria-label="Open the universal token burn studio">
      <Flame className="h-4 w-4" />
      <span>Burn studio</span>
    </Link>
  );
}
