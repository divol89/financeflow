// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking20Base.sol";

contract ImprovedMCowfarm is Staking20Base {

    uint256 public feePercentage = 1;  // Por defecto es 1%, pero puedes cambiarlo
    address public treasuryAddress;    // La dirección donde se enviarán las tarifas
    uint256 public accumulatedFees;    // Tarifas acumuladas en el contrato

    constructor(
        address _defaultAdmin,
        uint256 _timeUnit,
        uint256 _rewardRatioNumerator,
        uint256 _rewardRatioDenominator,
        address _stakingToken,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking20Base(
            _defaultAdmin,
            _timeUnit,
            _rewardRatioNumerator,
            _rewardRatioDenominator,
            _stakingToken,
            _rewardToken,
            _nativeTokenWrapper
        ) 
    {
        treasuryAddress = msg.sender; // Por defecto es el creador del contrato, pero puedes cambiarlo
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 100, "Fee can't be more than 100%");
        feePercentage = _feePercentage;
    }

    function setTreasuryAddress(address _treasuryAddress) external onlyOwner {
        treasuryAddress = _treasuryAddress;
    }

    function withdrawWithFee(uint256 amount) external nonReentrant {
        // Primero, actualizamos las recompensas acumuladas del usuario
        _updateUnclaimedRewardsForStaker(msg.sender);

        require(stakers[msg.sender].amountStaked >= amount, "Not enough staked");

        uint256 fee = (amount * feePercentage) / 100;
        uint256 amountAfterFee = amount - fee;

        // Acumula la tarifa en el contrato
        accumulatedFees += fee;

        // Transfiere al usuario el monto después de la tarifa
        IERC20(stakingToken).transfer(msg.sender, amountAfterFee);
        
        // Actualiza el balance staked del usuario
        stakers[msg.sender].amountStaked -= amount;

        emit TokensWithdrawn(msg.sender, amountAfterFee);
    }

    // Función para que treasuryAddress retire las tarifas acumuladas
    function withdrawFees() external {
        require(msg.sender == treasuryAddress, "Only treasury can withdraw fees");
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        IERC20(stakingToken).transfer(treasuryAddress, amount);
    }
}
