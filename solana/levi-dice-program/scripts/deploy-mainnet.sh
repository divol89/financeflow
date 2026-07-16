#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROGRAM_KEYPAIR="$ROOT_DIR/target/deploy/levi_dice-keypair.json"
PROGRAM_SO="$ROOT_DIR/target/deploy/levi_dice.so"
DEPLOY_WALLET="${SOLANA_DEPLOY_WALLET:-$(solana config get | awk -F': ' '/Keypair Path/ {print $2}')}"
DEPLOY_WALLET="$(echo "$DEPLOY_WALLET" | xargs)"

cd "$ROOT_DIR"

if [[ "${CONFIRM_MAINNET_DEPLOY:-}" != "YES" ]]; then
  cat >&2 <<'MSG'
Refusing mainnet deploy.
Set CONFIRM_MAINNET_DEPLOY=YES only after final review, funding the deploy wallet, and confirming treasury/config accounts.
MSG
  exit 1
fi

"$ROOT_DIR/scripts/preflight-mainnet.sh"

if command -v anchor >/dev/null 2>&1; then
  anchor build
else
  cargo build-sbf --manifest-path programs/levi-dice/Cargo.toml
fi

if [[ ! -f "$PROGRAM_SO" ]]; then
  echo "ERROR: expected SBF artifact not found: $PROGRAM_SO" >&2
  echo "If using raw cargo-build-sbf, inspect target/deploy for the generated .so path." >&2
  exit 1
fi

solana program deploy \
  -u mainnet-beta \
  -k "$DEPLOY_WALLET" \
  --program-id "$PROGRAM_KEYPAIR" \
  "$PROGRAM_SO"

echo "Deploy complete. Set frontend env:"
echo "NEXT_PUBLIC_AGENT_K9_DICE_PROGRAM_ID=$(solana-keygen pubkey "$PROGRAM_KEYPAIR")"
