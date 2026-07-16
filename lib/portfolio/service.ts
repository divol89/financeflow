import type { LeviAccessState } from "@/types/levi";
import type { PortfolioPayload } from "@/types/portfolio";
import {
  fetchPortfolioSnapshot,
  fetchRecentPortfolioActivity,
  type PortfolioActivityResult,
} from "./chain";
import { buildPortfolioCoverage } from "./coverage";
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
  const current = await fetchPortfolioSnapshot(wallet, new Date(), {
    [access.mint]: {
      raw: access.balanceRaw,
      decimals: access.decimals,
    },
  });
  const activityEnabled = access.limits.portfolioActivityLimit > 0;
  let activityFailed = false;
  let freshActivity: PortfolioActivityResult = {
    events: [],
    selectedSignatures: 0,
    loadedTransactions: 0,
    sourceCount: 0,
    partial: false,
    rateLimited: false,
  };

  if (activityEnabled) {
    try {
      freshActivity = await fetchRecentPortfolioActivity(wallet);
    } catch (error) {
      activityFailed = true;
      console.warn("K9 portfolio activity unavailable", error);
    }
  }

  try {
    await savePortfolioSnapshot(current);
    await savePortfolioActivity(wallet, freshActivity.events);
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
      coverage: buildPortfolioCoverage({
        activityEnabled,
        activityFailed,
        activityPartial: freshActivity.partial,
        storedActivityCount: activity.length,
        selectedSignatures: freshActivity.selectedSignatures,
        loadedTransactions: freshActivity.loadedTransactions,
        historyPoints: history.length,
        refreshedAt: current.capturedAt,
      }),
      persistenceAvailable: true,
    };
  } catch (error) {
    console.warn("K9 portfolio persistence unavailable", error);
    return {
      access,
      current,
      history: [],
      activity: freshActivity.events.slice(0, access.limits.portfolioActivityLimit),
      watchlist: [],
      journal: [],
      coverage: buildPortfolioCoverage({
        activityEnabled,
        activityFailed,
        activityPartial: freshActivity.partial,
        storedActivityCount: 0,
        selectedSignatures: freshActivity.selectedSignatures,
        loadedTransactions: freshActivity.loadedTransactions,
        historyPoints: 0,
        refreshedAt: current.capturedAt,
      }),
      persistenceAvailable: false,
      persistenceMessage:
        "Live balances are available, but private history is temporarily unavailable.",
    };
  }
}
