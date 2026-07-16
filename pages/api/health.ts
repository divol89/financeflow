import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_SOLANA, SOLANA_RPC_URL } from "@/lib/levi/constants";
import { AGENT_K9_MINT_ADDRESS } from "@/lib/levi/communityBurn";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: true,
    service: "agent-k9",
    mint: AGENT_K9_MINT_ADDRESS,
    rpcConfigured: Boolean(SOLANA_RPC_URL),
    mockSolana: MOCK_SOLANA,
    timestamp: new Date().toISOString(),
  });
}
