// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IUniswapV2RouterMinimal.sol";

contract PumpMeSir17 is Ownable(msg.sender), Pausable, ReentrancyGuard {
    uint256 public constant MARKETING_PERCENTAGE = 5;
    uint256 public constant DEV_PERCENTAGE = 5;
    uint256 public constant REWARD_PERCENTAGE = 50;
    uint256 public constant MINIMUM_VOTE_COST = 0.001 ether;

    uint256 public buyThreshold;
    address public marketingWallet;
    address public devWallet;
    IUniswapV2RouterMinimal public uniswapV2Router;

    bool public votingActive;
    address public winningToken;
    address[] public tokensVotedFor;
    mapping(address => uint256) public votesReceived;
    mapping(address => uint256) public userContributions;
    uint256 public totalContributions;

    mapping(address => mapping(address => bool)) public hasVoted;
    mapping(address => bool) public isVoter;
    address[] public votersList;

    uint256 public lastDistributionTimestamp;

    bool private rewardsReady = false;

    event Voted(address voter, address tokenAddress, uint256 amount);
    event FundsDistributed(uint256 marketingAmount, uint256 devAmount);
    event VotingStarted();
    event VotingEnded(address winningToken, uint256 tokensBought);
    event WinningTokenBought(address token, uint256 amount);
    event BuyThresholdUpdated(uint256 newThreshold);
    event DebugVote(
        address voter,
        address tokenAddress,
        uint256 amount,
        uint256 newTotalContributions
    );
    event DebugBuyWinningToken(uint256 iotaBalance, uint256 purchasedTokens);
    event RewardAssigned(
        address indexed voter,
        uint256 indexed round,
        uint256 reward
    );
    event RewardClaimed(
        address indexed user,
        uint256 indexed round,
        uint256 amount
    );
    event DebugAssignRewards(uint256 totalTokens, uint256 totalRewardTokens);
    event DebugGasLeft(uint256 gasLeft);

    struct RewardInfo {
        uint256 amount;
        bool claimed;
    }

    mapping(uint256 => mapping(address => RewardInfo)) public roundUserRewards;
    uint256 public currentRound;

    bool public rewardsAssigned = false;

    address public stakingContract;

    // Event to log token withdrawals for staking
    event TokensWithdrawnForStaking(address token, uint256 amount);

    constructor(
        address _marketingWallet,
        address _devWallet,
        address _uniswapRouter,
        uint256 _buyThreshold
    ) {
        require(_marketingWallet != address(0), "Invalid marketing wallet");
        require(_devWallet != address(0), "Invalid dev wallet");
        require(_uniswapRouter != address(0), "Invalid uniswap router");
        require(_buyThreshold > 0, "Invalid buy threshold");

        marketingWallet = _marketingWallet;
        devWallet = _devWallet;
        uniswapV2Router = IUniswapV2RouterMinimal(_uniswapRouter);
        buyThreshold = _buyThreshold;
    }

    function vote(
        address tokenAddress
    ) external payable whenNotPaused nonReentrant {
        require(
            msg.value >= MINIMUM_VOTE_COST,
            "Insufficient payment for voting"
        );
        require(tokenAddress != address(0), "Invalid token address");

        if (!votingActive) {
            _startNewVotingRound();
        }

        uint256 marketingAmount = (msg.value * MARKETING_PERCENTAGE) / 100;
        uint256 devAmount = (msg.value * DEV_PERCENTAGE) / 100;
        uint256 voteAmount = msg.value - marketingAmount - devAmount;

        (bool marketingSent, ) = payable(marketingWallet).call{
            value: marketingAmount
        }("");
        require(marketingSent, "Failed to send to marketing wallet");

        (bool devSent, ) = payable(devWallet).call{value: devAmount}("");
        require(devSent, "Failed to send to dev wallet");

        votesReceived[tokenAddress] += voteAmount;
        userContributions[msg.sender] += voteAmount;
        totalContributions += voteAmount;
        hasVoted[msg.sender][tokenAddress] = true;
        isVoter[msg.sender] = true;
        votersList.push(msg.sender);

        if (!_isTokenInVotedList(tokenAddress)) {
            tokensVotedFor.push(tokenAddress);
        }

        emit Voted(msg.sender, tokenAddress, voteAmount);
        emit FundsDistributed(marketingAmount, devAmount);
        emit DebugVote(
            msg.sender,
            tokenAddress,
            voteAmount,
            totalContributions
        );

        if (address(this).balance >= buyThreshold) {
            endVotingAndBuy();
        }
    }

    function endVotingAndBuy() public {
        require(votingActive, "Voting is not active");
        votingActive = false;
        winningToken = _determineWinningToken();
        uint256 tokensBought = _buyWinningToken();
        emit DebugGasLeft(gasleft());
        _assignRewards(tokensBought);
        _resetVotes(); // Add this line to reset votes
        currentRound++;
        emit VotingEnded(winningToken, tokensBought);
    }

    function assignRewardsIfNeeded() public {
        require(!votingActive, "Voting must be ended");
        require(!rewardsAssigned, "Rewards already assigned");
        uint256 tokensBought = IERC20(winningToken).balanceOf(address(this));
        _assignRewards(tokensBought);
        rewardsAssigned = true;
        currentRound++;
    }

    function _startNewVotingRound() private {
        votingActive = true;
        delete tokensVotedFor;
        emit VotingStarted();
    }

    function _determineWinningToken() private view returns (address) {
        require(tokensVotedFor.length > 0, "No tokens voted for");

        address currentWinningToken = tokensVotedFor[0];
        uint256 maxVotes = votesReceived[currentWinningToken];

        for (uint256 i = 1; i < tokensVotedFor.length; i++) {
            address token = tokensVotedFor[i];
            if (votesReceived[token] > maxVotes) {
                currentWinningToken = token;
                maxVotes = votesReceived[token];
            }
        }

        return currentWinningToken;
    }

    function _buyWinningToken() private returns (uint256) {
        uint256 iotaBalance = address(this).balance;

        address[] memory path = new address[](2);
        path[0] = uniswapV2Router.WETH();
        path[1] = winningToken;

        uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: iotaBalance
        }(0, path, address(this), block.timestamp + 300);

        uint256 purchasedTokens = IERC20(winningToken).balanceOf(address(this));
        emit WinningTokenBought(winningToken, purchasedTokens);
        emit DebugBuyWinningToken(iotaBalance, purchasedTokens);

        rewardsReady = true;
        return purchasedTokens;
    }

    function _isTokenInVotedList(address token) private view returns (bool) {
        for (uint256 i = 0; i < tokensVotedFor.length; i++) {
            if (tokensVotedFor[i] == token) {
                return true;
            }
        }
        return false;
    }

    function updateBuyThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold > 0, "Invalid threshold");
        buyThreshold = newThreshold;
        emit BuyThresholdUpdated(newThreshold);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}

    function debugContractState()
        external
        view
        returns (
            uint256 _totalContributions,
            uint256 _contractBalance,
            address _winningToken,
            uint256 _winningTokenBalance,
            bool _votingActive
        )
    {
        _totalContributions = totalContributions;
        _contractBalance = address(this).balance;
        _winningToken = winningToken;
        _winningTokenBalance = winningToken != address(0)
            ? IERC20(winningToken).balanceOf(address(this))
            : 0;
        _votingActive = votingActive;
    }

    function _assignRewards(uint256 totalTokens) private {
        uint256 totalRewardTokens = (totalTokens * REWARD_PERCENTAGE) / 100;
        emit DebugAssignRewards(totalTokens, totalRewardTokens);

        // Iterate through all voters
        for (uint256 i = 0; i < votersList.length; i++) {
            address voter = votersList[i];
            if (userContributions[voter] > 0) {
                uint256 userPercentage = (userContributions[voter] * 1e18) /
                    totalContributions;
                uint256 reward = (totalRewardTokens * userPercentage) / 1e18;
                if (reward > 0) {
                    roundUserRewards[currentRound][voter] = RewardInfo(
                        reward,
                        false
                    );
                    emit RewardAssigned(voter, currentRound, reward);
                }
            }
        }
    }

    function claimReward(uint256 round) external nonReentrant {
        RewardInfo storage reward = roundUserRewards[round][msg.sender];
        require(reward.amount > 0, "No rewards to claim");
        require(!reward.claimed, "Reward already claimed");

        reward.claimed = true;
        IERC20(winningToken).transfer(msg.sender, reward.amount);
        emit RewardClaimed(msg.sender, round, reward.amount);
    }

    function getUnclaimedRewards(
        address user
    )
        external
        view
        returns (uint256[] memory rounds, uint256[] memory amounts)
    {
        uint256 count = 0;
        for (uint256 i = 0; i <= currentRound; i++) {
            if (
                roundUserRewards[i][user].amount > 0 &&
                !roundUserRewards[i][user].claimed
            ) {
                count++;
            }
        }

        rounds = new uint256[](count);
        amounts = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i <= currentRound; i++) {
            if (
                roundUserRewards[i][user].amount > 0 &&
                !roundUserRewards[i][user].claimed
            ) {
                rounds[index] = i;
                amounts[index] = roundUserRewards[i][user].amount;
                index++;
            }
        }
    }

    // Add this new private function to reset votes
    function _resetVotes() private {
        for (uint256 i = 0; i < tokensVotedFor.length; i++) {
            address token = tokensVotedFor[i];
            votesReceived[token] = 0;
        }
        delete tokensVotedFor;
        totalContributions = 0;

        // Reset user contributions
        for (uint256 i = 0; i < votersList.length; i++) {
            address voter = votersList[i];
            userContributions[voter] = 0;
            for (uint256 j = 0; j < tokensVotedFor.length; j++) {
                hasVoted[voter][tokensVotedFor[j]] = false;
            }
        }
        delete votersList;
    }

    // Function to set the staking contract address
    function setStakingContract(address _stakingContract) external onlyOwner {
        require(
            _stakingContract != address(0),
            "Invalid staking contract address"
        );
        stakingContract = _stakingContract;
    }

    // Function to withdraw tokens to the staking contract
    function withdrawTokensForStaking(
        address token,
        uint256 amount
    ) external nonReentrant {
        require(
            msg.sender == stakingContract,
            "Only staking contract can call this function"
        );
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        IERC20 tokenContract = IERC20(token);
        uint256 contractBalance = tokenContract.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient balance");

        bool success = tokenContract.transfer(stakingContract, amount);
        require(success, "Token transfer failed");

        emit TokensWithdrawnForStaking(token, amount);
    }
}
