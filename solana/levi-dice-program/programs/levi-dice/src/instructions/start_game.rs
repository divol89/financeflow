use anchor_lang::prelude::*;

use crate::{Game, GameState, LeviDiceError, MIN_PLAYERS};

#[derive(Accounts)]
pub struct StartGame<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub game: Account<'info, Game>,
}

pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require!(
        game.state == GameState::Waiting,
        LeviDiceError::InvalidState
    );
    require!(
        ctx.accounts.authority.key() == game.creator,
        LeviDiceError::NotCreator
    );
    require!(
        game.player_count >= MIN_PLAYERS,
        LeviDiceError::InvalidPlayerCount
    );
    game.state = GameState::Committing;
    game.started_at = Clock::get()?.unix_timestamp;
    Ok(())
}
