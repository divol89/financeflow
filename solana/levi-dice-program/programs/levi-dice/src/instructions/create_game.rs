use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{
    instructions::token_helpers, Config, Game, GameState, LeviDiceError, ESCROW_SEED, GAME_SEED,
    K9_MINT, MAX_DURATION_SECONDS, MAX_PLAYERS, MIN_DURATION_SECONDS, MIN_PLAYERS,
};

#[derive(Accounts)]
#[instruction(game_nonce: u64)]
pub struct CreateGame<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        has_one = k9_mint @ LeviDiceError::InvalidK9Mint,
        constraint = config.treasury_token_account == treasury_token_account.key() @ LeviDiceError::InvalidTreasury
    )]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = creator,
        space = Game::LEN,
        seeds = [GAME_SEED, creator.key().as_ref(), &game_nonce.to_le_bytes(), config.key().as_ref()],
        bump
    )]
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = creator,
        token::mint = k9_mint,
        token::authority = game,
        token::token_program = token_program,
        seeds = [ESCROW_SEED, game.key().as_ref()],
        bump
    )]
    pub escrow: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        constraint = creator_token_account.owner == creator.key() @ LeviDiceError::PlayerNotFound,
        constraint = creator_token_account.mint == k9_mint.key() @ LeviDiceError::InvalidK9Mint
    )]
    pub creator_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        constraint = treasury_token_account.mint == k9_mint.key() @ LeviDiceError::InvalidTreasury
    )]
    pub treasury_token_account: InterfaceAccount<'info, TokenAccount>,
    pub k9_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn create_game(
    ctx: Context<CreateGame>,
    game_nonce: u64,
    entry_fee: u64,
    max_players: u8,
    commit_duration: i64,
    reveal_duration: i64,
) -> Result<()> {
    require_keys_eq!(
        ctx.accounts.k9_mint.key(),
        K9_MINT,
        LeviDiceError::InvalidK9Mint
    );
    require!(entry_fee > 0, LeviDiceError::InvalidEntryFee);
    require!(
        (MIN_PLAYERS..=MAX_PLAYERS).contains(&max_players),
        LeviDiceError::InvalidPlayerCount
    );
    require!(
        (MIN_DURATION_SECONDS..=MAX_DURATION_SECONDS).contains(&commit_duration),
        LeviDiceError::InvalidDuration
    );
    require!(
        (MIN_DURATION_SECONDS..=MAX_DURATION_SECONDS).contains(&reveal_duration),
        LeviDiceError::InvalidDuration
    );

    token_helpers::transfer_checked(
        ctx.accounts.creator_token_account.to_account_info(),
        ctx.accounts.k9_mint.to_account_info(),
        ctx.accounts.escrow.to_account_info(),
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        entry_fee,
        None,
    )?;

    let now = Clock::get()?.unix_timestamp;
    let game = &mut ctx.accounts.game;
    game.config = ctx.accounts.config.key();
    game.creator = ctx.accounts.creator.key();
    game.k9_mint = ctx.accounts.k9_mint.key();
    game.escrow = ctx.accounts.escrow.key();
    game.treasury_token_account = ctx.accounts.treasury_token_account.key();
    game.entry_fee = entry_fee;
    game.max_players = max_players;
    game.player_count = 0;
    game.state = GameState::Waiting;
    game.game_nonce = game_nonce;
    game.players = Game::empty_players();
    game.committed = [false; MAX_PLAYERS as usize];
    game.revealed = [false; MAX_PLAYERS as usize];
    game.commitments = [[0; 32]; MAX_PLAYERS as usize];
    game.rolls = [0; MAX_PLAYERS as usize];
    game.created_at = now;
    game.started_at = 0;
    game.commit_deadline = now
        .checked_add(commit_duration)
        .ok_or(error!(LeviDiceError::MathOverflow))?;
    game.reveal_deadline = game
        .commit_deadline
        .checked_add(reveal_duration)
        .ok_or(error!(LeviDiceError::MathOverflow))?;
    game.winner = Pubkey::default();
    game.bump = ctx.bumps.game;
    game.escrow_bump = ctx.bumps.escrow;
    game.add_player(ctx.accounts.creator.key())?;
    Ok(())
}
