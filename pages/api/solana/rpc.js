import { callSolanaRpcFromDashboard } from "../../../lib/server/solanaRpcProxy";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "64kb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { method, params = [] } = req.body || {};
    const result = await callSolanaRpcFromDashboard(req, { method, params });
    return res.status(200).json(result);
  } catch (error) {
    const status = Number(error.statusCode) || 500;
    return res.status(status).json({ error: error.message || "Solana RPC proxy failed" });
  }
}
