use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub authority: Pubkey,
    pub treasury_token_account: Pubkey,
    pub k9_mint: Pubkey,
    pub protocol_fee_bps: u16,
    pub bump: u8,
    pub paused: bool,
}

impl Config {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 2 + 1 + 1;
}
