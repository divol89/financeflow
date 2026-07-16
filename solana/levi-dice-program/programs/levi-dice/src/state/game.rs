use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hashv;

use crate::{LeviDiceError, BPS_DENOMINATOR, MAX_PLAYERS, PROTOCOL_FEE_BPS};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum GameState {
    Waiting,
    Committing,
    Revealing,
    Ended,
    Cancelled,
}

#[account]
pub struct Game {
    pub config: Pubkey,
    pub creator: Pubkey,
    pub k9_mint: Pubkey,
    pub escrow: Pubkey,
    pub treasury_token_account: Pubkey,
    pub entry_fee: u64,
    pub max_players: u8,
    pub player_count: u8,
    pub state: GameState,
    pub game_nonce: u64,
    pub players: [Pubkey; MAX_PLAYERS as usize],
    pub committed: [bool; MAX_PLAYERS as usize],
    pub revealed: [bool; MAX_PLAYERS as usize],
    pub commitments: [[u8; 32]; MAX_PLAYERS as usize],
    pub rolls: [u8; MAX_PLAYERS as usize],
    pub created_at: i64,
    pub started_at: i64,
    pub commit_deadline: i64,
    pub reveal_deadline: i64,
    pub winner: Pubkey,
    pub bump: u8,
    pub escrow_bump: u8,
}

impl Game {
    pub const LEN: usize = 8
        + 32 * 5
        + 8
        + 1
        + 1
        + 1
        + 8
        + 32 * MAX_PLAYERS as usize
        + MAX_PLAYERS as usize
        + MAX_PLAYERS as usize
        + 32 * MAX_PLAYERS as usize
        + MAX_PLAYERS as usize
        + 8 * 4
        + 32
        + 1
        + 1;

    pub fn empty_players() -> [Pubkey; MAX_PLAYERS as usize] {
        [Pubkey::default(); MAX_PLAYERS as usize]
    }

    pub fn player_index(&self, player: &Pubkey) -> Option<usize> {
        self.players[..self.player_count as usize]
            .iter()
            .position(|candidate| candidate == player)
    }

    pub fn add_player(&mut self, player: Pubkey) -> Result<()> {
        require!(
            self.player_count < self.max_players,
            LeviDiceError::GameFull
        );
        require!(
            self.player_index(&player).is_none(),
            LeviDiceError::PlayerAlreadyJoined
        );
        self.players[self.player_count as usize] = player;
        self.player_count += 1;
        Ok(())
    }

    pub fn all_committed(&self) -> bool {
        self.committed[..self.player_count as usize]
            .iter()
            .all(|item| *item)
    }

    pub fn all_revealed(&self) -> bool {
        self.revealed[..self.player_count as usize]
            .iter()
            .all(|item| *item)
    }

    pub fn any_revealed(&self) -> bool {
        self.revealed[..self.player_count as usize]
            .iter()
            .any(|item| *item)
    }

    pub fn pot(&self) -> Result<u64> {
        self.entry_fee
            .checked_mul(self.player_count as u64)
            .ok_or(error!(LeviDiceError::MathOverflow))
    }

    pub fn protocol_fee(&self) -> Result<u64> {
        self.pot()?
            .checked_mul(PROTOCOL_FEE_BPS as u64)
            .ok_or(error!(LeviDiceError::MathOverflow))?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(error!(LeviDiceError::MathOverflow))
    }

    pub fn winner_prize(&self) -> Result<u64> {
        self.pot()?
            .checked_sub(self.protocol_fee()?)
            .ok_or(error!(LeviDiceError::MathOverflow))
    }

    pub fn highest_revealed_index(&self) -> Option<usize> {
        let mut best: Option<usize> = None;
        for index in 0..self.player_count as usize {
            if !self.revealed[index] {
                continue;
            }
            match best {
                None => best = Some(index),
                Some(best_index) => {
                    if self.rolls[index] > self.rolls[best_index] {
                        best = Some(index);
                    }
                }
            }
        }
        best
    }
}

pub fn commitment_hash(player: &Pubkey, game: &Pubkey, roll: u8, nonce: &[u8; 32]) -> [u8; 32] {
    hashv(&[player.as_ref(), game.as_ref(), &[roll], nonce]).to_bytes()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calculates_95_5_payout_split() {
        let mut game = Game {
            config: Pubkey::default(),
            creator: Pubkey::default(),
            k9_mint: Pubkey::default(),
            escrow: Pubkey::default(),
            treasury_token_account: Pubkey::default(),
            entry_fee: 1_000_000,
            max_players: 5,
            player_count: 5,
            state: GameState::Revealing,
            game_nonce: 1,
            players: Game::empty_players(),
            committed: [false; MAX_PLAYERS as usize],
            revealed: [false; MAX_PLAYERS as usize],
            commitments: [[0; 32]; MAX_PLAYERS as usize],
            rolls: [0; MAX_PLAYERS as usize],
            created_at: 0,
            started_at: 0,
            commit_deadline: 0,
            reveal_deadline: 0,
            winner: Pubkey::default(),
            bump: 0,
            escrow_bump: 0,
        };
        assert_eq!(game.pot().unwrap(), 5_000_000);
        assert_eq!(game.protocol_fee().unwrap(), 250_000);
        assert_eq!(game.winner_prize().unwrap(), 4_750_000);

        game.player_count = 2;
        assert_eq!(game.protocol_fee().unwrap(), 100_000);
        assert_eq!(game.winner_prize().unwrap(), 1_900_000);
    }

    #[test]
    fn winner_uses_highest_roll_and_first_revealed_tie_break() {
        let mut game = Game {
            config: Pubkey::default(),
            creator: Pubkey::default(),
            k9_mint: Pubkey::default(),
            escrow: Pubkey::default(),
            treasury_token_account: Pubkey::default(),
            entry_fee: 10,
            max_players: 3,
            player_count: 3,
            state: GameState::Revealing,
            game_nonce: 1,
            players: Game::empty_players(),
            committed: [true; MAX_PLAYERS as usize],
            revealed: [true, true, true, false, false],
            commitments: [[0; 32]; MAX_PLAYERS as usize],
            rolls: [77, 91, 91, 0, 0],
            created_at: 0,
            started_at: 0,
            commit_deadline: 0,
            reveal_deadline: 0,
            winner: Pubkey::default(),
            bump: 0,
            escrow_bump: 0,
        };
        assert_eq!(game.highest_revealed_index(), Some(1));
        game.rolls[2] = 92;
        assert_eq!(game.highest_revealed_index(), Some(2));
    }

    #[test]
    fn commitment_hash_changes_with_nonce_or_roll() {
        let player = Pubkey::new_unique();
        let game = Pubkey::new_unique();
        let nonce = [7_u8; 32];
        let other_nonce = [8_u8; 32];
        assert_eq!(
            commitment_hash(&player, &game, 42, &nonce),
            commitment_hash(&player, &game, 42, &nonce)
        );
        assert_ne!(
            commitment_hash(&player, &game, 42, &nonce),
            commitment_hash(&player, &game, 43, &nonce)
        );
        assert_ne!(
            commitment_hash(&player, &game, 42, &nonce),
            commitment_hash(&player, &game, 42, &other_nonce)
        );
    }
}
