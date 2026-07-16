use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{instructions::token_helpers, Config, Game, GameState, LeviDiceError, K9_MINT};

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        constraint = config.key() == game.config @ LeviDiceError::InvalidState,
        constraint = config.k9_mint == k9_mint.key() @ LeviDiceError::InvalidK9Mint,
        constraint = config.treasury_token_account == game.treasury_token_account @ LeviDiceError::InvalidTreasury
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut, constraint = escrow.key() == game.escrow @ LeviDiceError::InvalidState)]
    pub escrow: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        constraint = player_token_account.owner == player.key() @ LeviDiceError::PlayerNotFound,
        constraint = player_token_account.mint == k9_mint.key() @ LeviDiceError::InvalidK9Mint
    )]
    pub player_token_account: InterfaceAccount<'info, TokenAccount>,
    pub k9_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}

pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.k9_mint.key(),
        K9_MINT,
        LeviDiceError::InvalidK9Mint
    );
    require!(
        ctx.accounts.game.state == GameState::Waiting,
        LeviDiceError::InvalidState
    );

    token_helpers::transfer_checked(
        ctx.accounts.player_token_account.to_account_info(),
        ctx.accounts.k9_mint.to_account_info(),
        ctx.accounts.escrow.to_account_info(),
        ctx.accounts.player.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.game.entry_fee,
        None,
    )?;

    ctx.accounts.game.add_player(ctx.accounts.player.key())?;
    Ok(())
}
