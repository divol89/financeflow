// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title CrazyDiceV4
 * @notice Gasless dice game - players roll off-chain, sign results, bot settles
 * @dev Uses ECDSA signature verification for trustless off-chain rolling
 */
contract CrazyDiceV4 is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    // ============================================
    // ENUMS & STRUCTS
    // ============================================
    
    enum GameState { WAITING, PLAYING, ENDED, CANCELLED }

    struct Game {
        uint256 id;
        uint256 entryFee;
        uint256 pot;
        uint256 maxPlayers;
        uint256 createdAt;
        uint256 gameStartedAt;
        address creator;
        address winner;
        GameState state;
    }

    // ============================================
    // STATE VARIABLES
    // ============================================
    
    uint256 public gameCounter;
    uint256 public protocolFeePercent = 5;
    uint256 public settlementTimeout = 10 minutes;
    uint256 public minPlayers = 2;
    uint256 public maxPlayersLimit = 5;
    
    address public feeRecipient;
    address public settlementBot;
    
    mapping(uint256 => Game) private _games;
    mapping(uint256 => address[]) public gamePlayers;
    mapping(uint256 => mapping(address => bool)) public hasJoined;
    mapping(uint256 => mapping(address => uint256)) public usedNonces;

    // ============================================
    // EVENTS
    // ============================================
    
    event GameCreated(uint256 indexed gameId, uint256 entryFee, uint256 maxPlayers, address indexed creator);
    event PlayerJoined(uint256 indexed gameId, address indexed player, uint256 currentPlayers);
    event GameStarted(uint256 indexed gameId, uint256 totalPlayers);
    event GameSettled(uint256 indexed gameId, address indexed winner, uint256[] rolls, uint256 payout);
    event GameCancelled(uint256 indexed gameId, string reason);
    event PlayerRefunded(uint256 indexed gameId, address indexed player, uint256 amount);

    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier gameExists(uint256 _gameId) {
        require(_gameId < gameCounter, "Game does not exist");
        _;
    }

    modifier onlySettlementBot() {
        require(msg.sender == settlementBot || msg.sender == owner(), "Not authorized");
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(address _settlementBot) {
        feeRecipient = msg.sender;
        settlementBot = _settlementBot;
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /**
     * @notice Create a new game
     */
    function createGame(uint256 _maxPlayers) external payable nonReentrant {
        require(msg.value > 0, "Entry fee must be > 0");
        require(_maxPlayers >= minPlayers && _maxPlayers <= maxPlayersLimit, "Invalid player count");

        uint256 gameId = gameCounter++;
        
        Game storage g = _games[gameId];
        g.id = gameId;
        g.entryFee = msg.value;
        g.pot = msg.value;
        g.maxPlayers = _maxPlayers;
        g.createdAt = block.timestamp;
        g.creator = msg.sender;
        g.state = GameState.WAITING;

        gamePlayers[gameId].push(msg.sender);
        hasJoined[gameId][msg.sender] = true;

        emit GameCreated(gameId, msg.value, _maxPlayers, msg.sender);
        emit PlayerJoined(gameId, msg.sender, 1);
    }

    /**
     * @notice Join an existing game
     */
    function joinGame(uint256 _gameId) external payable gameExists(_gameId) nonReentrant {
        Game storage g = _games[_gameId];
        require(g.state == GameState.WAITING, "Game not waiting");
        require(msg.value == g.entryFee, "Incorrect entry fee");
        require(gamePlayers[_gameId].length < g.maxPlayers, "Game full");
        require(!hasJoined[_gameId][msg.sender], "Already joined");

        gamePlayers[_gameId].push(msg.sender);
        hasJoined[_gameId][msg.sender] = true;
        g.pot += msg.value;

        uint256 currentPlayers = gamePlayers[_gameId].length;
        emit PlayerJoined(_gameId, msg.sender, currentPlayers);

        if (currentPlayers == g.maxPlayers) {
            g.state = GameState.PLAYING;
            g.gameStartedAt = block.timestamp;
            emit GameStarted(_gameId, currentPlayers);
        }
    }

    /**
     * @notice Start game early (creator only)
     */
    function startGameEarly(uint256 _gameId) external gameExists(_gameId) {
        Game storage g = _games[_gameId];
        require(g.state == GameState.WAITING, "Game not waiting");
        require(msg.sender == g.creator, "Only creator");
        require(gamePlayers[_gameId].length >= minPlayers, "Need min players");

        g.state = GameState.PLAYING;
        g.gameStartedAt = block.timestamp;
        
        emit GameStarted(_gameId, gamePlayers[_gameId].length);
    }

    /**
     * @notice Settle game with signed rolls from all players
     * @dev Called by settlement bot with all player signatures
     */
    function settleGame(
        uint256 _gameId,
        uint256[] calldata _rolls,
        uint256[] calldata _nonces,
        bytes[] calldata _signatures
    ) external gameExists(_gameId) onlySettlementBot nonReentrant {
        Game storage g = _games[_gameId];
        require(g.state == GameState.PLAYING, "Game not playing");
        
        uint256 playerCount = gamePlayers[_gameId].length;
        require(_rolls.length == playerCount, "Rolls mismatch");
        require(_signatures.length == playerCount, "Sigs mismatch");
        require(_nonces.length == playerCount, "Nonces mismatch");

        // Verify signatures and find winner
        (address winner, uint256 highestRoll) = _verifyAndFindWinner(
            _gameId, _rolls, _nonces, _signatures
        );

        // End game
        g.state = GameState.ENDED;
        g.winner = winner;

        // Payout
        _distributeWinnings(_gameId, winner, _rolls);
    }

    /**
     * @dev Verify all signatures and find the winner
     */
    function _verifyAndFindWinner(
        uint256 _gameId,
        uint256[] calldata _rolls,
        uint256[] calldata _nonces,
        bytes[] calldata _signatures
    ) internal returns (address winner, uint256 highestRoll) {
        address[] memory players = gamePlayers[_gameId];
        
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            uint256 roll = _rolls[i];
            uint256 nonce = _nonces[i];
            
            // Verify signature
            address signer = _recoverSigner(_gameId, roll, nonce, _signatures[i]);
            require(signer == player, "Invalid signature");
            
            // Check nonce
            require(usedNonces[_gameId][player] < nonce, "Nonce used");
            usedNonces[_gameId][player] = nonce;

            // Validate roll
            require(roll >= 1 && roll <= 100, "Invalid roll");

            // Track winner
            if (roll > highestRoll) {
                highestRoll = roll;
                winner = player;
            }
        }
    }

    /**
     * @dev Distribute winnings to winner and protocol
     */
    function _distributeWinnings(
        uint256 _gameId,
        address _winner,
        uint256[] calldata _rolls
    ) internal {
        Game storage g = _games[_gameId];
        uint256 totalPot = g.pot;
        uint256 fee = (totalPot * protocolFeePercent) / 100;
        uint256 payout = totalPot - fee;
        
        g.pot = 0;

        if (_winner != address(0) && payout > 0) {
            payable(_winner).transfer(payout);
        }

        if (fee > 0 && feeRecipient != address(0)) {
            payable(feeRecipient).transfer(fee);
        }

        emit GameSettled(_gameId, _winner, _rolls, payout);
    }

    /**
     * @notice Cancel game and refund (for stuck games)
     */
    function cancelGame(uint256 _gameId) external gameExists(_gameId) nonReentrant {
        Game storage g = _games[_gameId];
        require(g.state == GameState.WAITING || g.state == GameState.PLAYING, "Cannot cancel");
        
        // Only creator can cancel waiting games
        // Anyone can cancel playing games after timeout
        if (g.state == GameState.WAITING) {
            require(msg.sender == g.creator, "Only creator can cancel waiting games");
        } else {
            require(
                block.timestamp > g.gameStartedAt + settlementTimeout,
                "Settlement timeout not reached"
            );
        }

        g.state = GameState.CANCELLED;
        
        // Refund all players
        address[] memory players = gamePlayers[_gameId];
        uint256 refundAmount = g.entryFee;
        
        for (uint256 i = 0; i < players.length; i++) {
            payable(players[i]).transfer(refundAmount);
            emit PlayerRefunded(_gameId, players[i], refundAmount);
        }
        
        g.pot = 0;
        emit GameCancelled(_gameId, "Game cancelled");
    }

    // ============================================
    // SIGNATURE VERIFICATION
    // ============================================

    /**
     * @notice Recover signer from roll signature
     * @dev Message format: keccak256(abi.encodePacked(gameId, roll, nonce, address(this)))
     */
    function _recoverSigner(
        uint256 _gameId,
        uint256 _roll,
        uint256 _nonce,
        bytes calldata _signature
    ) internal view returns (address) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(_gameId, _roll, _nonce, address(this))
        );
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        return ethSignedHash.recover(_signature);
    }

    /**
     * @notice Get the message hash that players should sign
     * @dev Use this to generate the message for signing on frontend
     */
    function getRollMessageHash(
        uint256 _gameId,
        uint256 _roll,
        uint256 _nonce
    ) external view returns (bytes32) {
        return keccak256(
            abi.encodePacked(_gameId, _roll, _nonce, address(this))
        );
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    function games(uint256 _gameId) external view returns (
        uint256 entryFee,
        uint256 pot,
        GameState state,
        address winner
    ) {
        Game storage g = _games[_gameId];
        return (g.entryFee, g.pot, g.state, g.winner);
    }

    function getGameDetails(uint256 _gameId) external view returns (
        uint256 id,
        uint256 entryFee,
        uint256 pot,
        uint256 maxPlayers,
        uint256 currentPlayers,
        GameState state,
        address creator,
        address winner
    ) {
        Game storage g = _games[_gameId];
        return (
            g.id,
            g.entryFee,
            g.pot,
            g.maxPlayers,
            gamePlayers[_gameId].length,
            g.state,
            g.creator,
            g.winner
        );
    }

    function getGameTimestamps(uint256 _gameId) external view returns (
        uint256 createdAt,
        uint256 gameStartedAt
    ) {
        Game storage g = _games[_gameId];
        return (g.createdAt, g.gameStartedAt);
    }

    function playersCount(uint256 _gameId) external view returns (uint256) {
        return gamePlayers[_gameId].length;
    }

    function getGamePlayers(uint256 _gameId) external view returns (address[] memory) {
        return gamePlayers[_gameId];
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    function setSettlementBot(address _bot) external onlyOwner {
        require(_bot != address(0), "Invalid address");
        settlementBot = _bot;
    }

    function setProtocolFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 10, "Fee too high");
        protocolFeePercent = _feePercent;
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
    }

    function setSettlementTimeout(uint256 _timeout) external onlyOwner {
        require(_timeout >= 5 minutes && _timeout <= 1 hours, "Invalid timeout");
        settlementTimeout = _timeout;
    }

    function setPlayerLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min >= 2 && _min <= _max && _max <= 10, "Invalid limits");
        minPlayers = _min;
        maxPlayersLimit = _max;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
