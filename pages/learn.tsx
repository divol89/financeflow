import Head from "next/head";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Droplets,
  GraduationCap,
  LineChart,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import {
  MarketCycleChart,
  PositionLoopDiagram,
  RealizedProfitChart,
} from "@/components/levi/LearningCharts";

const mechanics = [
  {
    title: "Attention",
    icon: Sparkles,
    body: "A memecoin is a coordination game around attention. Narrative can bring people in, but attention is not the same thing as liquidity or durable demand.",
  },
  {
    title: "Liquidity",
    icon: Droplets,
    body: "Liquidity is the available depth for buyers and sellers. When the pool is thin, even a modest sale can create large slippage and move the price against you.",
  },
  {
    title: "Price discovery",
    icon: LineChart,
    body: "Price is the last traded agreement, not a guarantee that the whole position can exit at that number. The larger your order, the more the market can move while filling it.",
  },
];

const failureModes = [
  {
    number: "01",
    title: "They confuse conviction with a plan",
    body: "Liking a project is a reason to research it, not a reason to surrender every exit decision. A thesis should include what would make you reduce, pause or leave.",
  },
  {
    number: "02",
    title: "They round-trip unrealized gains",
    body: "A position can show a large paper gain and still finish below the entry price. Without a method for realizing value, the market decides when your gain disappears.",
  },
  {
    number: "03",
    title: "They ignore size and liquidity",
    body: "A token balance is not automatically liquid wealth. Check pool depth, volume, holder concentration, fees and expected slippage before treating a quoted price as cash.",
  },
  {
    number: "04",
    title: "They only add, never rebalance",
    body: "Accumulating more tokens while the position grows can increase concentration and emotional pressure. Rebalancing protects the person behind the wallet.",
  },
];

const operatingRules = [
  "Define the maximum amount of capital you can lose before entering.",
  "Write down what you are trying to achieve: exposure, a trade, a community role or a long-term core.",
  "Choose levels where you will realize portions before the price moves, not after the chart makes the decision for you.",
  "Keep records of proceeds, remaining balance, fees and cost basis. Memory is not accounting.",
  "Keep a core only when the thesis remains valid and the remaining size is still comfortable.",
  "Never use borrowed money, emergency funds or money needed for daily life to chase volatility.",
];

export default function LearnPage() {
  return (
    <LeviShell>
      <Head>
        <title>Learn | LEVI Sentinel</title>
        <meta
          name="description"
          content="A practical, risk-aware guide to memecoin mechanics, liquidity and realized profit."
        />
      </Head>

      <div className="levi-learn-page">
        <div className="levi-learn-grid" aria-hidden="true" />
        <div className="levi-learn-glow" aria-hidden="true" />

        <section className="levi-container levi-learn-hero">
          <LeviReveal>
            <div className="levi-learn-hero-copy">
              <p className="levi-eyebrow">
                <GraduationCapIcon /> LEVI field guide / Learn
              </p>
              <h1 className="levi-learn-title">
                Memecoins,
                <span>without the noise.</span>
              </h1>
              <p className="levi-learn-lede">
                A guide to understanding what you are buying, why many people watch
                gains appear on screen only to give them back, and how to manage a
                position with more discipline than hope.
              </p>
              <div className="levi-learn-hero-actions">
                <a href="#mechanics" className="levi-primary-button">
                  Start with the mechanics <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#operating-loop" className="levi-secondary-button">
                  See the operating loop
                </a>
              </div>
              <p className="levi-learn-hero-note">
                General educational information and illustrative material. Not financial advice or a promise of results.
              </p>
            </div>
          </LeviReveal>

          <LeviReveal>
            <div className="levi-learn-hero-art" aria-label="LEVI learning visual">
              <div className="levi-learn-orbit orbit-one" aria-hidden="true" />
              <div className="levi-learn-orbit orbit-two" aria-hidden="true" />
              <Image
                src="/levi-avatar.png"
                alt="LEVI bull"
                width={520}
                height={520}
                sizes="(max-width: 767px) 224px, 400px"
              />
              <div className="levi-learn-art-label">
                <span>Position system</span>
                <strong>Attention / Liquidity / Discipline</strong>
              </div>
            </div>
          </LeviReveal>
        </section>

        <section id="mechanics" className="levi-container levi-learn-section">
          <LeviReveal>
            <div className="levi-learn-section-heading">
              <div>
                <p className="levi-section-label"><LineChart className="h-3.5 w-3.5" /> The mechanics</p>
                <h2>A memecoin is not just a chart.</h2>
                <p>
                  Price is the visible output of a system shaped by narrative, supply,
                  liquidity, human behavior and market conditions.
                </p>
              </div>
              <div className="levi-learn-formula">
                <span>Market cap</span>
                <strong>Price × circulating supply</strong>
              </div>
            </div>
          </LeviReveal>

          <div className="levi-learn-mechanics-grid">
            {mechanics.map((item, index) => {
              const Icon = item.icon;
              return (
                <LeviReveal key={item.title}>
                  <article className="levi-learn-mechanic">
                    <span className="levi-learn-index">0{index + 1}</span>
                    <Icon className="levi-learn-mechanic-icon" />
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                </LeviReveal>
              );
            })}
          </div>

          <LeviReveal>
            <MarketCycleChart />
          </LeviReveal>
        </section>

        <section className="levi-container levi-learn-section levi-learn-section-dark">
          <LeviReveal>
            <div className="levi-learn-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><CircleAlert className="h-3.5 w-3.5" /> The common trap</p>
                <h2>Why holding without a plan often destroys gains.</h2>
                <p>
                  Holding is not automatically wrong. The problem is treating it as a
                  complete strategy when it only describes one action: not selling. A
                  position without rules turns a potential realized gain into a number
                  that can disappear as quickly as it arrived.
                </p>
              </div>
            </div>
          </LeviReveal>

          <div className="levi-learn-failure-grid">
            {failureModes.map((item) => (
              <LeviReveal key={item.number}>
                <article className="levi-learn-failure">
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              </LeviReveal>
            ))}
          </div>

          <LeviReveal>
            <RealizedProfitChart />
          </LeviReveal>
        </section>

        <section id="operating-loop" className="levi-container levi-learn-section">
          <LeviReveal>
            <div className="levi-learn-section-heading">
              <div>
                <p className="levi-section-label"><Scale className="h-3.5 w-3.5" /> The operating loop</p>
                <h2>If you like a project, work the position.</h2>
                <p>
                  Being a holder can mean supporting, researching, communicating and
                  keeping part of the token. It also means managing position risk so
                  you can keep participating tomorrow.
                </p>
              </div>
              <div className="levi-learn-callout">
                <ShieldCheck className="h-5 w-5" />
                <span>Conviction is a thesis. Risk management is the operating system.</span>
              </div>
            </div>
          </LeviReveal>

          <LeviReveal>
            <PositionLoopDiagram />
          </LeviReveal>

          <div className="levi-learn-phases-grid">
            <LeviReveal>
              <article className="levi-learn-phase phase-build">
                <span className="levi-learn-phase-number">01 / Build</span>
                <h3>Accumulate with a reason.</h3>
                <p>
                  Define the problem, community or narrative that makes you participate.
                  Buying more only because the price fell is not a thesis; it is a
                  decision that needs to be checked again.
                </p>
              </article>
            </LeviReveal>
            <LeviReveal>
              <article className="levi-learn-phase phase-protect">
                <span className="levi-learn-phase-number">02 / Protect</span>
                <h3>Convert part of the value.</h3>
                <p>
                  Selling in tranches can recover capital, cover costs and reduce
                  emotional pressure without forcing you to abandon the entire project.
                </p>
              </article>
            </LeviReveal>
            <LeviReveal>
              <article className="levi-learn-phase phase-compound">
                <span className="levi-learn-phase-number">03 / Compound</span>
                <h3>Reinvest with evidence.</h3>
                <p>
                  If you buy again, let the reason be liquidity, activity, distribution,
                  product or community that still justifies the exposure.
                </p>
              </article>
            </LeviReveal>
          </div>
        </section>

        <section className="levi-container levi-learn-section levi-learn-section-dark">
          <LeviReveal>
            <div className="levi-learn-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><WalletCards className="h-3.5 w-3.5" /> A practical checklist</p>
                <h2>Before you buy, sell or add.</h2>
                <p>
                  No formula removes volatility. A process can reduce impulsive decisions
                  and make your results measurable.
                </p>
              </div>
            </div>
          </LeviReveal>

          <div className="levi-learn-checklist">
            {operatingRules.map((rule) => (
              <div key={rule} className="levi-learn-check">
                <span><Check className="h-4 w-4" /></span>
                <p>{rule}</p>
              </div>
            ))}
          </div>

          <LeviReveal>
            <div className="levi-learn-risk-note">
              <LockKeyhole className="h-5 w-5" />
              <div>
                <strong>Liquidity is part of risk too.</strong>
                <p>
                  A large sale can move price, especially in small pools. Do not confuse
                  the value shown by an app with the cash you can actually withdraw at
                  the expected price.
                </p>
              </div>
            </div>
          </LeviReveal>
        </section>

        <section className="levi-container levi-learn-disclaimer">
          <p className="levi-section-label"><ShieldCheck className="h-3.5 w-3.5" /> Keep the signal clean</p>
          <h2>The goal is not to sell everything. It is to stay in control.</h2>
          <p>
            The charts in this guide are illustrative. Memecoins can lose much or all of
            their value, have limited liquidity and be exposed to adverse contracts,
            teams or markets. Do your own research and consult a qualified professional
            for your situation.
          </p>
        </section>
      </div>
    </LeviShell>
  );
}

function GraduationCapIcon() {
  return <GraduationCap className="h-3.5 w-3.5" />;
}
