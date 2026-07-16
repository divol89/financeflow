#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROGRAM_KEYPAIR="$ROOT_DIR/target/deploy/levi_dice-keypair.json"
PROGRAM_ID_EXPECTED="CvQidDgoUvQdY81LGUmS4tyG1UeY6Hxj3M6ie3yExyrM"
DEPLOY_WALLET="${SOLANA_DEPLOY_WALLET:-$(solana config get | awk -F': ' '/Keypair Path/ {print $2}')}"
DEPLOY_WALLET="$(echo "$DEPLOY_WALLET" | xargs)"

cd "$ROOT_DIR"

echo "== K9 Dice mainnet preflight =="
echo "Root: $ROOT_DIR"
echo "Cluster: mainnet-beta"

echo "\n-- Tooling --"
command -v solana
solana --version
if command -v anchor >/dev/null 2>&1; then
  anchor --version
else
  echo "WARN: anchor CLI not installed; using cargo/solana checks only."
fi
if command -v cargo-build-sbf >/dev/null 2>&1; then
  cargo build-sbf --version || true
else
  echo "WARN: cargo-build-sbf not found; SBF build/deploy cannot run."
fi

echo "\n-- Program keypair --"
if [[ ! -f "$PROGRAM_KEYPAIR" ]]; then
  echo "ERROR: missing program keypair at $PROGRAM_KEYPAIR" >&2
  exit 1
fi
PROGRAM_ID_ACTUAL="$(solana-keygen pubkey "$PROGRAM_KEYPAIR")"
echo "Program ID: $PROGRAM_ID_ACTUAL"
if [[ "$PROGRAM_ID_ACTUAL" != "$PROGRAM_ID_EXPECTED" ]]; then
  echo "ERROR: program keypair does not match declare_id!/Anchor.toml" >&2
  exit 1
fi

echo "\n-- Deploy wallet --"
if [[ ! -f "$DEPLOY_WALLET" ]]; then
  echo "ERROR: deploy wallet not found: $DEPLOY_WALLET" >&2
  echo "Set SOLANA_DEPLOY_WALLET=/path/to/keypair.json" >&2
  exit 1
fi
DEPLOY_ADDRESS="$(solana address -k "$DEPLOY_WALLET")"
BALANCE="$(solana balance -u mainnet-beta -k "$DEPLOY_WALLET")"
echo "Deploy wallet: $DEPLOY_ADDRESS"
echo "Mainnet SOL balance: $BALANCE"

BALANCE_NUM="$(echo "$BALANCE" | awk '{print $1}')"
python3 - <<PY
balance = float("$BALANCE_NUM")
# Deploying upgradeable programs needs enough SOL for buffer/program rent + fees.
# Exact amount depends on .so size; below this, deployment is definitely not production-ready.
if balance < 1.0:
    raise SystemExit("ERROR: deploy wallet has less than 1 SOL; fund it before mainnet deploy.")
PY

echo "\n-- Tests --"
cargo +1.96 test

echo "\nPreflight passed. Mainnet deployment still requires explicit CONFIRM_MAINNET_DEPLOY=YES."
