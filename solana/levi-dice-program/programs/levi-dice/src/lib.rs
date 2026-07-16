use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("CvQidDgoUvQdY81LGUmS4tyG1UeY6Hxj3M6ie3yExyrM");

pub const K9_MINT: Pubkey = pubkey!("6NHjTmLAGcN41EDzx1kofRtgLCieF233yKidydTzpump");

#[program]
pub mod levi_dice {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        instructions::initialize_config(ctx)
    }

    pub fn create_game(
        ctx: Context<CreateGame>,
        game_nonce: u64,
        entry_fee: u64,
        max_players: u8,
        commit_duration: i64,
        reveal_duration: i64,
    ) -> Result<()> {
        instructions::create_game(
            ctx,
            game_nonce,
            entry_fee,
            max_players,
            commit_duration,
            reveal_duration,
        )
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        instructions::join_game(ctx)
    }

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        instructions::start_game(ctx)
    }

    pub fn commit_roll(ctx: Context<CommitRoll>, commitment: [u8; 32]) -> Result<()> {
        instructions::commit_roll(ctx, commitment)
    }

    pub fn reveal_roll(ctx: Context<RevealRoll>, roll: u8, nonce: [u8; 32]) -> Result<()> {
        instructions::reveal_roll(ctx, roll, nonce)
    }

    pub fn settle_game(ctx: Context<SettleGame>) -> Result<()> {
        instructions::settle_game(ctx)
    }

    pub fn cancel_game(ctx: Context<CancelGame>) -> Result<()> {
        instructions::cancel_game(ctx)
    }

    pub fn forfeit_timeout(ctx: Context<ForfeitTimeout>) -> Result<()> {
        instructions::forfeit_timeout(ctx)
    }
}
