use anchor_lang::prelude::*;

use crate::{commitment_hash, Game, GameState, LeviDiceError};

#[derive(Accounts)]
pub struct RevealRoll<'info> {
    pub player: Signer<'info>,
    #[account(mut)]
    pub game: Account<'info, Game>,
}

pub fn reveal_roll(ctx: Context<RevealRoll>, roll: u8, nonce: [u8; 32]) -> Result<()> {
    let game_key = ctx.accounts.game.key();
    let game = &mut ctx.accounts.game;
    require!(
        game.state == GameState::Revealing,
        LeviDiceError::InvalidState
    );
    require!((1..=100).contains(&roll), LeviDiceError::InvalidRoll);

    let player_key = ctx.accounts.player.key();
    let index = game
        .player_index(&player_key)
        .ok_or(error!(LeviDiceError::PlayerNotFound))?;
    require!(game.committed[index], LeviDiceError::MissingCommits);
    require!(!game.revealed[index], LeviDiceError::AlreadyRevealed);

    let expected = commitment_hash(&player_key, &game_key, roll, &nonce);
    require!(
        expected == game.commitments[index],
        LeviDiceError::InvalidReveal
    );

    game.rolls[index] = roll;
    game.revealed[index] = true;
    Ok(())
}
