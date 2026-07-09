use anchor_lang::prelude::*;

use crate::{Game, GameState, LeviDiceError};

#[derive(Accounts)]
pub struct CommitRoll<'info> {
    pub player: Signer<'info>,
    #[account(mut)]
    pub game: Account<'info, Game>,
}

pub fn commit_roll(ctx: Context<CommitRoll>, commitment: [u8; 32]) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require!(
        game.state == GameState::Committing,
        LeviDiceError::InvalidState
    );
    let index = game
        .player_index(&ctx.accounts.player.key())
        .ok_or(error!(LeviDiceError::PlayerNotFound))?;
    require!(!game.committed[index], LeviDiceError::AlreadyCommitted);

    game.commitments[index] = commitment;
    game.committed[index] = true;

    if game.all_committed() {
        game.state = GameState::Revealing;
    }
    Ok(())
}
