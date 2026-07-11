import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requirePortfolioSession } from "@/lib/portfolio/auth";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import {
  createJournalEntry,
  listJournal,
  removeJournalEntry,
  updateJournalEntry,
} from "@/lib/portfolio/store";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";

const EntrySchema = z.object({
  id: z.string().uuid().optional(),
  decision: z.enum(["watch", "entered", "trimmed", "exited", "avoided"]),
  tokenMint: z.string().min(32).max(64),
  targetWallet: z.string().min(32).max(64).nullable().optional(),
  thesis: z.string().min(3).max(1000),
  invalidation: z.string().max(1000).default(""),
  notes: z.string().max(2000).default(""),
  outcome: z.string().max(1000).default(""),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const limited = checkRateLimit(`portfolio-journal:${getClientKey(req)}`, 60, 60_000);
    if (!limited.allowed) return res.status(429).json({ error: "Too many journal requests" });
    const { session, access } = await requirePortfolioSession(req);
    if (req.method === "GET") {
      return res.status(200).json({ journal: await listJournal(session.wallet) });
    }
    if (req.method === "POST" || req.method === "PATCH") {
      const parsed = EntrySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid journal entry" });
      const common = {
        ownerWallet: session.wallet,
        decision: parsed.data.decision,
        tokenMint: normalizeSolanaAddress(parsed.data.tokenMint),
        targetWallet: parsed.data.targetWallet
          ? normalizeSolanaAddress(parsed.data.targetWallet)
          : null,
        thesis: parsed.data.thesis,
        invalidation: parsed.data.invalidation,
        notes: parsed.data.notes,
        outcome: parsed.data.outcome,
      };
      if (req.method === "PATCH") {
        if (!parsed.data.id) return res.status(400).json({ error: "Journal id required" });
        return res.status(200).json({
          entry: await updateJournalEntry({ ...common, id: parsed.data.id }),
        });
      }
      return res.status(201).json({
        entry: await createJournalEntry({ ...common, limit: access.limits.journalLimit }),
      });
    }
    if (req.method === "DELETE") {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      if (!id || !z.string().uuid().safeParse(id).success) {
        return res.status(400).json({ error: "Invalid journal id" });
      }
      await removeJournalEntry(session.wallet, id);
      return res.status(204).end();
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") {
      return res.status(401).json({ error: "Connect and sign your wallet first" });
    }
    const message = error instanceof Error ? error.message : "Journal failed";
    const status = /limit|requires/i.test(message) ? 403 : 500;
    return res.status(status).json({ error: message });
  }
}
