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
    <Card className="bg-gray-800 border-b border-gray-700 p-4 shadow-sm  border-2 mb-4">
      <CardHeader>
        <h2 className="text-2xl text-gray-400">Unclaimed Rewards</h2>
      </CardHeader>
      <CardContent>
        {unclaimedRewards.length > 0 ? (
          unclaimedRewards.map((reward) => (
            <div key={reward.round} className="mb-4">
              <p className="text-sm text-black">
                Round {reward.round}: {parseFloat(reward.amount).toFixed(6)}{" "}
                {reward.tokenName}
              </p>
              <Button
                onClick={() => claimReward(reward.round)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Claim Reward
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No unclaimed rewards</p>
        )}
        {unclaimedRewards.length > 1 && (
          <Button
            onClick={claimAllRewards}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Claim All Rewards
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsDropdown;
