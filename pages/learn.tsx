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
                <span>sin ruido.</span>
              </h1>
              <p className="levi-learn-lede">
                Una guía para entender qué estás comprando, por qué muchas personas
                ven ganancias en pantalla y terminan sin realizarlas, y cómo operar una
                posición con más disciplina que esperanza.
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
                Educación general e ilustrativa. No es asesoramiento financiero ni una promesa de resultados.
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
                <h2>Una memecoin no es solo un gráfico.</h2>
                <p>
                  El precio es la salida visible de un sistema con narrativa, oferta,
                  liquidez, comportamiento humano y condiciones de mercado.
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
                <h2>Por qué holdear sin plan suele destruir la ganancia.</h2>
                <p>
                  Holdear no es automáticamente malo. El problema es tratarlo como una
                  estrategia completa cuando solo describe una acción: no vender. Una
                  posición sin reglas convierte una ganancia realizada potencial en una
                  cifra que puede desaparecer con la misma velocidad con la que llegó.
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
                <h2>Si te gusta un proyecto, trabájalo.</h2>
                <p>
                  Ser holder puede significar apoyar, investigar, comunicar y mantener
                  una parte del token. También significa gestionar el riesgo de la
                  posición para poder seguir participando mañana.
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
                <h3>Acumula con una razón.</h3>
                <p>
                  Define qué problema, comunidad o narrativa te hace participar. Comprar
                  más solo porque bajó no es una tesis; es una decisión que necesita una
                  nueva comprobación.
                </p>
              </article>
            </LeviReveal>
            <LeviReveal>
              <article className="levi-learn-phase phase-protect">
                <span className="levi-learn-phase-number">02 / Protect</span>
                <h3>Convierte parte del valor.</h3>
                <p>
                  Vender por tramos puede recuperar capital, pagar costes y bajar la
                  presión emocional sin obligarte a abandonar todo el proyecto.
                </p>
              </article>
            </LeviReveal>
            <LeviReveal>
              <article className="levi-learn-phase phase-compound">
                <span className="levi-learn-phase-number">03 / Compound</span>
                <h3>Reinvierte con evidencia.</h3>
                <p>
                  Si vuelves a comprar, que sea por liquidez, actividad, distribución,
                  producto o comunidad que sigan justificando la exposición.
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
                <h2>Antes de comprar, vender o añadir.</h2>
                <p>
                  No existe una fórmula que elimine la volatilidad. Sí existe un proceso
                  que reduce decisiones impulsivas y hace que tus resultados sean medibles.
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
                <strong>La liquidez también es parte del riesgo.</strong>
                <p>
                  Una venta grande puede mover el precio, especialmente en pools pequeños.
                  No confundas el valor mostrado por una app con el efectivo que realmente
                  puedes retirar al precio esperado.
                </p>
              </div>
            </div>
          </LeviReveal>
        </section>

        <section className="levi-container levi-learn-disclaimer">
          <p className="levi-section-label"><ShieldCheck className="h-3.5 w-3.5" /> Keep the signal clean</p>
          <h2>El objetivo no es venderlo todo. Es no perder el control.</h2>
          <p>
            Los gráficos de esta guía son ilustrativos. Los memecoins pueden perder gran
            parte o todo su valor, tener liquidez limitada y estar expuestos a contratos,
            equipos o mercados adversos. Haz tu propia investigación y consulta a un
            profesional cualificado para tu situación.
          </p>
        </section>
      </div>
    </LeviShell>
  );
}

function GraduationCapIcon() {
  return <GraduationCap className="h-3.5 w-3.5" />;
}
