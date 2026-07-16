use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{Config, LeviDiceError, CONFIG_SEED, K9_MINT, PROTOCOL_FEE_BPS};

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = Config::LEN,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,
    pub k9_mint: InterfaceAccount<'info, Mint>,
    #[account(
        constraint = treasury_token_account.mint == k9_mint.key() @ LeviDiceError::InvalidTreasury
    )]
    pub treasury_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.k9_mint.key(),
        K9_MINT,
        LeviDiceError::InvalidK9Mint
    );

    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.treasury_token_account = ctx.accounts.treasury_token_account.key();
    config.k9_mint = ctx.accounts.k9_mint.key();
    config.protocol_fee_bps = PROTOCOL_FEE_BPS;
    config.bump = ctx.bumps.config;
    config.paused = false;
    Ok(())
}
