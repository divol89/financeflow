use anchor_lang::prelude::*;

#[error_code]
pub enum LeviDiceError {
    #[msg("Only the existing K9 Token-2022 mint is accepted")]
    InvalidK9Mint,
    #[msg("Treasury token account must be for the K9 mint")]
    InvalidTreasury,
    #[msg("Protocol fee must be exactly 5%")]
    InvalidProtocolFee,
    #[msg("Entry fee must be greater than zero")]
    InvalidEntryFee,
    #[msg("Games require 2 to 5 players")]
    InvalidPlayerCount,
    #[msg("Duration is outside the allowed range")]
    InvalidDuration,
    #[msg("Game state does not allow this instruction")]
    InvalidState,
    #[msg("The game is already full")]
    GameFull,
    #[msg("This wallet already joined the game")]
    PlayerAlreadyJoined,
    #[msg("Signer is not a player in this game")]
    PlayerNotFound,
    #[msg("Only the game creator may do this")]
    NotCreator,
    #[msg("Player already committed")]
    AlreadyCommitted,
    #[msg("Player already revealed")]
    AlreadyRevealed,
    #[msg("Commitment does not match the revealed roll and nonce")]
    InvalidReveal,
    #[msg("Roll must be between 1 and 100")]
    InvalidRoll,
    #[msg("Not all required players have committed")]
    MissingCommits,
    #[msg("Not all required players have revealed")]
    MissingReveals,
    #[msg("Timeout has not expired yet")]
    TimeoutNotExpired,
    #[msg("Remaining token accounts do not match joined players")]
    InvalidRefundAccounts,
    #[msg("Arithmetic overflow")]
    MathOverflow,
}
