import type { LeviAccessState } from "@/types/levi";
import type { PortfolioPayload } from "@/types/portfolio";
import { fetchPortfolioSnapshot, fetchRecentPortfolioActivity } from "./chain";
import {
  listJournal,
  listPortfolioActivity,
  listPortfolioSnapshots,
  listWatchlist,
  savePortfolioActivity,
  savePortfolioSnapshot,
} from "./store";

export async function refreshPortfolio(
  wallet: string,
  access: LeviAccessState
): Promise<PortfolioPayload> {
  const current = await fetchPortfolioSnapshot(wallet);
  const freshActivity =
    access.limits.portfolioActivityLimit > 0
      ? await fetchRecentPortfolioActivity(wallet)
      : [];

  try {
    await savePortfolioSnapshot(current);
    await savePortfolioActivity(wallet, freshActivity);
    const [history, activity, watchlist, journal] = await Promise.all([
      listPortfolioSnapshots(wallet, access.limits.portfolioHistoryDays),
      listPortfolioActivity(wallet, access.limits.portfolioActivityLimit),
      access.limits.watchlistLimit > 0 ? listWatchlist(wallet) : Promise.resolve([]),
      access.limits.journalLimit > 0 ? listJournal(wallet) : Promise.resolve([]),
    ]);
    return {
      access,
      current,
      history,
      activity,
      watchlist,
      journal,
      persistenceAvailable: true,
    };
  } catch (error) {
    console.warn("LEVI portfolio persistence unavailable", error);
    return {
      access,
      current,
      history: [],
      activity: freshActivity.slice(0, access.limits.portfolioActivityLimit),
      watchlist: [],
      journal: [],
      persistenceAvailable: false,
      persistenceMessage:
        "Live balances are available, but private history is temporarily unavailable.",
    };
  }
}
