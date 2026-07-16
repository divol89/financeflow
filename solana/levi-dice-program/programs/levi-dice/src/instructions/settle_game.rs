use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{
    instructions::token_helpers, Config, Game, GameState, LeviDiceError, GAME_SEED, K9_MINT,
};

#[derive(Accounts)]
pub struct SettleGame<'info> {
    #[account(
        constraint = config.key() == game.config @ LeviDiceError::InvalidState,
        constraint = config.treasury_token_account == treasury_token_account.key() @ LeviDiceError::InvalidTreasury,
        constraint = config.k9_mint == k9_mint.key() @ LeviDiceError::InvalidK9Mint
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut, constraint = escrow.key() == game.escrow @ LeviDiceError::InvalidState)]
    pub escrow: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, constraint = winner_token_account.mint == k9_mint.key() @ LeviDiceError::InvalidK9Mint)]
    pub winner_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, constraint = treasury_token_account.key() == config.treasury_token_account @ LeviDiceError::InvalidTreasury)]
    pub treasury_token_account: InterfaceAccount<'info, TokenAccount>,
    pub k9_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}

pub fn settle_game(ctx: Context<SettleGame>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.k9_mint.key(),
        K9_MINT,
        LeviDiceError::InvalidK9Mint
    );
    require!(
        ctx.accounts.game.state == GameState::Revealing,
        LeviDiceError::InvalidState
    );
    require!(
        ctx.accounts.game.all_revealed(),
        LeviDiceError::MissingReveals
    );
    let winner_index = ctx
        .accounts
        .game
        .highest_revealed_index()
        .ok_or(error!(LeviDiceError::MissingReveals))?;
    require_keys_eq!(
        ctx.accounts.winner_token_account.owner,
        ctx.accounts.game.players[winner_index],
        LeviDiceError::InvalidRefundAccounts
    );

    distribute_pot(
        &mut ctx.accounts.game,
        ctx.accounts.escrow.to_account_info(),
        ctx.accounts.k9_mint.to_account_info(),
        ctx.accounts.winner_token_account.to_account_info(),
        ctx.accounts.treasury_token_account.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
    )
}

pub fn distribute_pot<'info>(
    game: &mut Account<'info, Game>,
    escrow: AccountInfo<'info>,
    k9_mint: AccountInfo<'info>,
    winner_token_account: AccountInfo<'info>,
    treasury_token_account: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
) -> Result<()> {
    let winner_index = game
        .highest_revealed_index()
        .ok_or(error!(LeviDiceError::MissingReveals))?;
    let winner = game.players[winner_index];
    let winner_amount = game.winner_prize()?;
    let fee_amount = game.protocol_fee()?;
    let nonce_bytes = game.game_nonce.to_le_bytes();
    let bump = [game.bump];
    let seeds: &[&[u8]] = &[
        GAME_SEED,
        game.creator.as_ref(),
        &nonce_bytes,
        game.config.as_ref(),
        &bump,
    ];
    let signer_seeds = &[seeds];

    token_helpers::transfer_checked(
        escrow.clone(),
        k9_mint.clone(),
        winner_token_account,
        game.to_account_info(),
        token_program.clone(),
        winner_amount,
        Some(signer_seeds),
    )?;

    if fee_amount > 0 {
        token_helpers::transfer_checked(
            escrow,
            k9_mint,
            treasury_token_account,
            game.to_account_info(),
            token_program,
            fee_amount,
            Some(signer_seeds),
        )?;
    }

    game.winner = winner;
    game.state = GameState::Ended;
    Ok(())
}
