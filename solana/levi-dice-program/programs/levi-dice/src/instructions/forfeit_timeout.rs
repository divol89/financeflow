use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{
    instructions::{cancel_game::refund_all_players, settle_game::distribute_pot},
    Config, Game, GameState, LeviDiceError, K9_MINT,
};

#[derive(Accounts)]
pub struct ForfeitTimeout<'info> {
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

pub fn forfeit_timeout(ctx: Context<ForfeitTimeout>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.k9_mint.key(),
        K9_MINT,
        LeviDiceError::InvalidK9Mint
    );
    let now = Clock::get()?.unix_timestamp;
    let refund_accounts = [
        &ctx.accounts.refund_0,
        &ctx.accounts.refund_1,
        &ctx.accounts.refund_2,
        &ctx.accounts.refund_3,
        &ctx.accounts.refund_4,
    ];

    match ctx.accounts.game.state {
        GameState::Committing => {
            require!(
                now > ctx.accounts.game.commit_deadline,
                LeviDiceError::TimeoutNotExpired
            );
            refund_all_players(
                &mut ctx.accounts.game,
                ctx.accounts.escrow.to_account_info(),
                ctx.accounts.k9_mint.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                refund_accounts,
            )?;
            ctx.accounts.game.state = GameState::Cancelled;
            Ok(())
        }
        GameState::Revealing => {
            require!(
                now > ctx.accounts.game.reveal_deadline,
                LeviDiceError::TimeoutNotExpired
            );
            if !ctx.accounts.game.any_revealed() {
                refund_all_players(
                    &mut ctx.accounts.game,
                    ctx.accounts.escrow.to_account_info(),
                    ctx.accounts.k9_mint.to_account_info(),
                    ctx.accounts.token_program.to_account_info(),
                    refund_accounts,
                )?;
                ctx.accounts.game.state = GameState::Cancelled;
                return Ok(());
            }

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
        _ => err!(LeviDiceError::InvalidState),
    }
}
