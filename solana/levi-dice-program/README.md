# LEVI Dice Solana Program

Anchor-style Solana program for the LEVI Dice version of Crazy Dice.

## Scope

- Uses the existing LEVI Token-2022 mint only: `6baGyq4HLbUn93MQUGFqBktpXP8BRjpoxSsAap4ppump`.
- Does **not** create a new token.
- Does **not** include custodial backend keys, hot wallets, seed phrases, or paid RPC requirements.
- Does **not** deploy automatically. Deployment must be explicitly approved and signed by the user's wallet.

## Program ID

Current local/declarative program ID:

```text
CvQidDgoUvQdY81LGUmS4tyG1UeY6Hxj3M6ie3yExyrM
```

After an approved deploy, set the frontend variable to the deployed program ID:

```bash
NEXT_PUBLIC_LEVI_DICE_PROGRAM_ID=CvQidDgoUvQdY81LGUmS4tyG1UeY6Hxj3M6ie3yExyrM
```

If you deploy with a different keypair, update `declare_id!`, `Anchor.toml`, and the frontend variable together.

## Architecture

PDAs/accounts:

| Account | Seeds / role |
| --- | --- |
| `config` | `['config']`; stores authority, LEVI mint, treasury token account, 5% fee. |
| `game` | `['game', creator, game_nonce, config]`; stores room, player, commit/reveal, deadline, and settlement state. |
| `escrow` | `['escrow', game]`; Token-2022 token account owned by the `game` PDA. |

States:

```text
Waiting -> Committing -> Revealing -> Ended
Waiting/Committing/Revealing -> Cancelled where allowed
```

Instructions:

- `initialize_config`
- `create_game`
- `join_game`
- `start_game`
- `commit_roll`
- `reveal_roll`
- `settle_game`
- `cancel_game`
- `forfeit_timeout`

## Game rules

- 2 to 5 players.
- Each player deposits `entry_fee` in LEVI Token-2022 into the escrow PDA.
- Protocol fee is fixed at `500` basis points = 5%.
- Winner receives 95% of the pot.
- Treasury token account receives 5% of the pot.
- Highest revealed roll wins; ties resolve in favor of the earliest player index for deterministic settlement.

## Commit-reveal

Players do not write their roll directly during commit.

Frontend/client should compute:

```text
commitment = sha256(player_pubkey || game_pubkey || roll_u8 || nonce_32_bytes)
```

Then:

1. Call `commit_roll(commitment)`.
2. Once all players committed, call `reveal_roll(roll, nonce)`.
3. `settle_game` verifies all revealed rolls and distributes escrow.

This avoids the unsafe `Math.random()`/single-transaction randomness pattern for on-chain settlement. Client entropy is still user-side, so production UX should make nonce generation explicit and private until reveal.

## Timeout / AFK handling

`forfeit_timeout` handles stalled games:

- In `Committing`, after `commit_deadline`, it cancels and refunds joined players.
- In `Revealing`, after `reveal_deadline`:
  - if nobody revealed, it cancels and refunds;
  - if at least one player revealed, unrevealed players forfeit and settlement pays the best revealed roll.

For refund paths, the instruction expects five refund token accounts (`refund_0` through `refund_4`) and uses only the first `player_count` accounts. Pass the joined players' LEVI token accounts in player order.

## Local commands

Anchor CLI was not installed on this machine when this program was created, so the verified local path uses Cargo directly with the installed Rust 1.96 toolchain:

```bash
cd /Users/josealmontecolon/Documents/flowfinance/work/financeflow-site/solana/levi-dice-program
cargo +1.96 fmt
cargo +1.96 test
cargo +1.96 build
```

If Anchor CLI is installed later:

```bash
anchor build
anchor test
```

For local validator work, use free/local infrastructure only:

```bash
solana-test-validator
solana config set --url localhost
anchor deploy
```

Do not deploy to devnet/mainnet without explicit user approval.

## Mainnet production preflight/deploy scripts

This folder includes guarded scripts for production deployment:

```bash
cd /Users/josealmontecolon/Documents/flowfinance/work/financeflow-site/solana/levi-dice-program

# Safe checks only. Does not deploy.
./scripts/preflight-mainnet.sh

# Mainnet deploy. Refuses to run unless CONFIRM_MAINNET_DEPLOY=YES is set.
CONFIRM_MAINNET_DEPLOY=YES \
SOLANA_DEPLOY_WALLET=/path/to/funded/mainnet-keypair.json \
./scripts/deploy-mainnet.sh
```

Current blocker observed on this machine: no approved funded deployment keypair is configured, and Anchor CLI is not installed. Install/repair Anchor/SBF tooling and choose a user-approved deploy wallet before any production deploy.

Do not send community development funding to a deploy wallet. Public SOL funding for LEVI agentic development goes only to the agent wallet `Cdij4T6EXdz1MFGChuqBNo7kZ8E5unTSLyeP8SGvazZ4`. When approved funding thresholds are reached, the autonomous agent can continue scoped work with Fable and GPT-5.6 Sol, under Magneto supervision.

Production frontend env template added at repo root:

```text
.env.production.example
```

## Deployment checklist

1. Review/audit program logic and accounts.
2. Confirm treasury LEVI Token-2022 token account.
3. Confirm deploy keypair and program ID.
4. Run `cargo +1.96 test` and, if available, `anchor test`.
5. Obtain explicit user approval for deploy.
6. Deploy with the user's wallet/keypair; never commit private keys.
7. Set frontend env:

```bash
NEXT_PUBLIC_LEVI_DICE_PROGRAM_ID=<program_id>
```

## Security notes

- `LEVI_MINT` is hard-coded to `6baGyq4HLbUn93MQUGFqBktpXP8BRjpoxSsAap4ppump`.
- Token transfers use `anchor_spl::token_interface` for Token-2022 compatibility.
- No backend settlement signer is required.
- No paid RPC/node dependency is required by the program.
- The generated local keypair under `target/` is ignored and must not be committed.
