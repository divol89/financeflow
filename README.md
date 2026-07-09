# Flow Finance / LEVI Sentinel

Production site for `flow-finance.xyz`, connected to the GitHub repo `divol89/financeflow`.

## Product

LEVI Sentinel is a token-gated Solana risk-intelligence interface. It scans recent creator-wallet activity for heuristic signals such as mint creation and possible creator-side sell events. The scanner does not label intent or prove wrongdoing.

The LEVI token already exists:

```text
6baGyq4HLbUn93MQUGFqBktpXP8BRjpoxSsAap4ppump
```

RPC verification shows it is a Token-2022 mint with symbol `LEVI`.

## Access Tiers

- `< 3,000 LEVI`: locked scanner, public pages only.
- `>= 3,000 LEVI`: basic scanner summary.
- `>= 50,000 LEVI`: full dashboard details and larger scan window.

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
npm run scan:levi -- <solana-wallet>
```

Use `MOCK_SOLANA=1` only for local UI demos.

## Existing Game

Crazy Dice is preserved at `/games` and `/games/crazy-dice/[id]`. It uses IOTA EVM, Web3Modal/Ethers, Firebase turn state, and `/api/games/settle`.
