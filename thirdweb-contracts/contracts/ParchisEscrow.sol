// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParchisEscrow {
    address public owner;
    address public signerAddress; // The server wallet allowed to sign wins
    uint256 public gameCounter;

    struct Game {
        uint256 id;
        uint256 entryFee;
        uint256 pot;
        address[] players;
        bool ended;
        address winner;
    }

    mapping(uint256 => Game) public games;

    event GameCreated(uint256 indexed gameId, uint256 entryFee, address creator);
    event PlayerJoined(uint256 indexed gameId, address player);
    event GameEnded(uint256 indexed gameId, address winner, uint256 payout);

    constructor() {
        owner = msg.sender;
        signerAddress = msg.sender; // Initially deployer is the signer
    }

    function setSigner(address _signer) external {
        require(msg.sender == owner, "Only owner");
        signerAddress = _signer;
    }

    // 1. Create a Game Room
    function createGame() external payable {
        require(msg.value > 0, "Entry fee required");

        games[gameCounter] = Game({
            id: gameCounter,
            entryFee: msg.value,
            pot: msg.value,
            players: new address[](0),
            ended: false,
            winner: address(0)
        });

        games[gameCounter].players.push(msg.sender);

        emit GameCreated(gameCounter, msg.value, msg.sender);
        gameCounter++;
    }

    // 2. Join an existing Room
    function joinGame(uint256 _gameId) external payable {
        Game storage g = games[_gameId];
        require(!g.ended, "Game ended");
        require(g.players.length < 4, "Room full"); // Parchis is 4 players
        require(msg.value == g.entryFee, "Incorrect fee");

        g.players.push(msg.sender);
        g.pot += msg.value;

        emit PlayerJoined(_gameId, msg.sender);
    }

    // 3. Claim Winnings (Requires Server Signature)
    // Signature must sign: keccak256(gameId, winnerAddress)
    function claimWin(uint256 _gameId, bytes memory _signature) external {
        Game storage g = games[_gameId];
        require(!g.ended, "Game already ended");
        require(g.pot > 0, "No pot to claim");

        // Verify that msg.sender is the winner authorized by the server
        bytes32 messageHash = keccak256(abi.encodePacked(_gameId, msg.sender));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        address recoveredSigner = recoverSigner(ethSignedMessageHash, _signature);
        require(recoveredSigner == signerAddress, "Invalid signature");

        // Payout
        uint256 payout = g.pot;
        uint256 fee = (payout * 5) / 100; // 5% Platform Fee
        uint256 prize = payout - fee;

        g.pot = 0; // Re-entrancy protection
        g.ended = true;
        g.winner = msg.sender;

        // Transfers
        (bool successOwner, ) = payable(owner).call{value: fee}("");
        require(successOwner, "Fee transfer failed");

        (bool successWinner, ) = payable(msg.sender).call{value: prize}("");
        require(successWinner, "Prize transfer failed");

        emit GameEnded(_gameId, msg.sender, prize);
    }

    // --- Helper Functions for Signature Verification ---

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function getPlayers(uint256 _gameId) external view returns (address[] memory) {
        return games[_gameId].players;
    }
}
