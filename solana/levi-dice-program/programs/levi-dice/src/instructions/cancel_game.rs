use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{instructions::token_helpers, Game, GameState, LeviDiceError, GAME_SEED, LEVI_MINT};

#[derive(Accounts)]
pub struct CancelGame<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut, constraint = escrow.key() == game.escrow @ LeviDiceError::InvalidState)]
    pub escrow: InterfaceAccount<'info, TokenAccount>,
    pub levi_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    #[account(mut)]
    pub refund_0: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub refund_1: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub refund_2: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub refund_3: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub refund_4: InterfaceAccount<'info, TokenAccount>,
}

pub fn cancel_game(ctx: Context<CancelGame>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.levi_mint.key(),
        LEVI_MINT,
        LeviDiceError::InvalidLeviMint
    );
    require!(
        ctx.accounts.creator.key() == ctx.accounts.game.creator,
        LeviDiceError::NotCreator
    );
    require!(
        ctx.accounts.game.state == GameState::Waiting,
        LeviDiceError::InvalidState
    );

    let refund_accounts = [
        &ctx.accounts.refund_0,
        &ctx.accounts.refund_1,
        &ctx.accounts.refund_2,
        &ctx.accounts.refund_3,
        &ctx.accounts.refund_4,
    ];

    refund_all_players(
        &mut ctx.accounts.game,
        ctx.accounts.escrow.to_account_info(),
        ctx.accounts.levi_mint.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        refund_accounts,
    )?;
    ctx.accounts.game.state = GameState::Cancelled;
    Ok(())
}

pub fn refund_all_players<'info>(
    game: &mut Account<'info, Game>,
    escrow: AccountInfo<'info>,
    levi_mint: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    refund_token_accounts: [&InterfaceAccount<'info, TokenAccount>; 5],
) -> Result<()> {
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

    for index in 0..game.player_count as usize {
        let refund_account = refund_token_accounts[index];
        require_keys_eq!(
            refund_account.owner,
            game.players[index],
            LeviDiceError::InvalidRefundAccounts
        );
        require_keys_eq!(
            refund_account.mint,
            game.levi_mint,
            LeviDiceError::InvalidLeviMint
        );
        token_helpers::transfer_checked(
            escrow.clone(),
            levi_mint.clone(),
            refund_account.to_account_info(),
            game.to_account_info(),
            token_program.clone(),
            game.entry_fee,
            Some(signer_seeds),
        )?;
    }
    Ok(())
}
