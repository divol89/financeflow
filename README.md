# Flow-Finance Adventures

Production site for [flow-finance.xyz](https://flow-finance.xyz/), connected to `divol89/financeflow`.

## Product

Flow-Finance Adventures is a light, token-neutral toolkit for exploring Solana memecoins. It combines wallet and token evidence scanning, portfolio history, beginner-facing token checks, educational content and a noncustodial universal burn studio.

The public burn ledger verifies finalized burns recorded by the portal and keeps totals separated by mint. It does not claim to index every historical burn on Solana.

Scanner signals are heuristic and informational. They do not prove intent, guarantee safety or replace independent research.

## Hosted Adventures

Individual memecoins can keep their own identity, campaign and utility inside the shared platform. Agent K9 is the current hosted adventure used by the Social Quest and Dice preview. Platform tools do not require users to hold K9 or any other project token:

- Symbol: `K9`
- Program: Token-2022
- Mint: `6NHjTmLAGcN41EDzx1kofRtgLCieF233yKidydTzpump`

## Development

```bash
cp .env.example .env.local
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Use `MOCK_SOLANA=1` only for local UI demos.

## Legacy Routes

K9 Dice remains at `/games/levi-dice`. Crazy Dice is preserved at `/games` and `/games/crazy-dice/[id]` as an independent IOTA EVM game, but is not part of the shared navigation.
