pub const MIN_PLAYERS: u8 = 2;
pub const MAX_PLAYERS: u8 = 5;
pub const PROTOCOL_FEE_BPS: u16 = 500;
pub const BPS_DENOMINATOR: u64 = 10_000;
pub const K9_DECIMALS: u8 = 6;
pub const MIN_DURATION_SECONDS: i64 = 30;
pub const MAX_DURATION_SECONDS: i64 = 24 * 60 * 60;

pub const CONFIG_SEED: &[u8] = b"config";
pub const GAME_SEED: &[u8] = b"game";
pub const ESCROW_SEED: &[u8] = b"escrow";
