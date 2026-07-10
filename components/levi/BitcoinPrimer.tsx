import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  FileText,
  KeyRound,
  Network,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { LeviReveal } from "@/components/levi/LeviReveal";

const bitcoinFlow = [
  {
    label: "Keys and ownership",
    detail: "A wallet protects private keys. The keys authorize spending; an address is not an account at a bank.",
    icon: KeyRound,
  },
  {
    label: "Transactions",
    detail: "A signed transaction proposes a transfer. Nodes independently check the rules before relaying it.",
    icon: WalletCards,
  },
  {
    label: "Blocks and proof of work",
    detail: "Miners package valid transactions into blocks and spend work to make rewriting the history expensive.",
    icon: Blocks,
  },
  {
    label: "Confirmation",
    detail: "Each block added after a payment strengthens the shared record, while users remain responsible for verification.",
    icon: ShieldCheck,
  },
];

const bitcoinPrinciples = [
  {
    label: "Monetary policy",
    title: "Rules, not a central issuer.",
    detail:
      "Bitcoin's issuance schedule is enforced by network consensus and approaches a 21 million BTC supply. New issuance falls over time, while transaction fees help fund block production.",
  },
  {
    label: "Settlement",
    title: "Confirmations are not customer support.",
    detail:
      "Bitcoin transactions are designed to be hard to reverse after confirmation. Always verify the destination, amount and fee before signing a transfer.",
  },
  {
    label: "Self-custody",
    title: "Control and responsibility travel together.",
    detail:
      "Anyone with a recovery phrase or private key can move the funds. Never share either, and understand the tradeoff between self-custody and third-party custody.",
  },
];

export function BitcoinPrimer() {
  return (
    <section id="bitcoin-primer" className="levi-container levi-docs-section levi-docs-section-dark">
      <LeviReveal>
        <div className="levi-docs-section-heading compact-heading">
          <div>
            <p className="levi-section-label">
              <FileText className="h-3.5 w-3.5" /> Bitcoin educational primer
            </p>
            <h2>Understand the network before you form an opinion about the asset.</h2>
            <p>
              Bitcoin is an open, peer-to-peer monetary network. It lets people verify ownership and transfer value through shared software rules, rather than relying on one company or bank to maintain the ledger.
            </p>
          </div>
        </div>
      </LeviReveal>

      <LeviReveal>
        <div className="levi-docs-two-column">
          <article className="levi-docs-copy-block">
            <p className="levi-section-label">
              <FileText className="h-3.5 w-3.5" /> The original paper
            </p>
            <h2>Bitcoin: A Peer-to-Peer Electronic Cash System.</h2>
            <p>
              Published in 2008 under the name Satoshi Nakamoto, the whitepaper explains a way to prevent double spending without a central intermediary. It combines digital signatures, a shared timestamped history and proof of work.
            </p>
            <a
              className="levi-secondary-button mt-6"
              href="https://bitcoin.org/bitcoin.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Read the original whitepaper <ArrowUpRight className="h-4 w-4" />
            </a>
          </article>

          <article className="levi-docs-copy-block">
            <p className="levi-section-label">
              <Network className="h-3.5 w-3.5" /> What Bitcoin is
            </p>
            <h2>A network, a protocol and a scarce digital asset.</h2>
            <p>
              Bitcoin is not a company and no single party controls the ledger. Independent nodes validate transactions against the same rules, while the BTC asset is the native unit used within that system.
            </p>
            <p>
              Its public ledger makes transfers auditable, but public addresses are not the same as real-world identities. Good research separates what the protocol guarantees from claims made by exchanges, influencers or projects built around it.
            </p>
          </article>
        </div>
      </LeviReveal>

      <LeviReveal>
        <div className="levi-docs-flow mt-3" aria-label="How a Bitcoin transaction is processed">
          {bitcoinFlow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="levi-docs-flow-step" key={step.label}>
                <div className="levi-docs-flow-icon"><Icon className="h-4 w-4" /></div>
                <span>0{index + 1}</span>
                <strong>{step.label}</strong>
                <p>{step.detail}</p>
                {index < bitcoinFlow.length - 1 ? (
                  <ArrowRight className="levi-docs-flow-arrow" aria-hidden="true" />
                ) : null}
              </div>
            );
          })}
        </div>
      </LeviReveal>

      <LeviReveal>
        <div className="levi-docs-ai-grid mt-3">
          {bitcoinPrinciples.map((principle) => (
            <article key={principle.label}>
              <span>{principle.label}</span>
              <strong>{principle.title}</strong>
              <p>{principle.detail}</p>
            </article>
          ))}
        </div>
      </LeviReveal>
    </section>
  );
}
