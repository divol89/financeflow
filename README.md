# Agent K9

Production site for [flow-finance.xyz](https://flow-finance.xyz/), connected to the GitHub repository `divol89/financeflow`.

## Product

Agent K9 is a Solana intelligence and community utility platform. It combines wallet and token evidence scanning, portfolio history, beginner-facing token checks, holder campaigns, educational content, K9 Dice and a non-custodial universal token burner.

Scanner signals are heuristic and informational. They do not prove intent, guarantee safety or replace independent research.

## Main Token

- Name: Agent K9
- Symbol: `K9`
- Program: Token-2022
- Decimals: `6`
- Initial supply: `1,000,000,000`
- Mint: `6NHjTmLAGcN41EDzx1kofRtgLCieF233yKidydTzpump`

## Access Tiers

- `< 3,000 K9`: public tools, balances, education and tier progress.
- `>= 3,000 K9`: Basic Scanner and Portfolio limits.
- `>= 50,000 K9`: Full Scanner and expanded Portfolio limits.

## Development

```bash
cp .env.example .env.local
npm run dev
```

Useful commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run scan:k9 -- <solana-wallet>
```

Use `MOCK_SOLANA=1` only for local UI demos.

## Games

K9 Dice is available at `/games/levi-dice`; the legacy path is retained for compatibility. Crazy Dice remains preserved at `/games` and `/games/crazy-dice/[id]` as an independent IOTA EVM game.
