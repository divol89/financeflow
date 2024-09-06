import React from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface RewardInfo {
  round: number;
  amount: string;
  token: string;
  tokenName: string; // Add this line
}

interface StatsDropdownProps {
  unclaimedRewards: RewardInfo[];
  claimReward: (round: number) => void;
  claimAllRewards: () => void;
}

const StatsDropdown: React.FC<StatsDropdownProps> = ({
  unclaimedRewards,
  claimReward,
  claimAllRewards,
}) => {
  return (
    <Card className="bg-gray-800 border-cyan-500 border-2 mb-4">
      <CardHeader>
        <h2 className="text-2xl text-cyan-400">Unclaimed Rewards</h2>
      </CardHeader>
      <CardContent>
        {unclaimedRewards.length > 0 ? (
          unclaimedRewards.map((reward) => (
            <div key={reward.round} className="mb-4">
              <p className="text-sm text-cyan-300">
                Round {reward.round}: {parseFloat(reward.amount).toFixed(6)}{" "}
                {reward.tokenName}
              </p>
              <Button
                onClick={() => claimReward(reward.round)}
                className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Claim Reward
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-cyan-300">No unclaimed rewards</p>
        )}
        {unclaimedRewards.length > 1 && (
          <Button
            onClick={claimAllRewards}
            className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Claim All Rewards
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsDropdown;
