import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Blocks,
  Check,
  CircleCheck,
  CircleDollarSign,
  KeyRound,
  Network,
  RotateCcw,
  ShieldCheck,
  TimerReset,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { LeviReveal } from "@/components/levi/LeviReveal";

const chapters = [
  {
    id: "problem",
    index: "01",
    label: "The problem",
    title: "Digital cash needs a shared answer to double spending.",
    summary:
      "A digital file can be copied. A payment system therefore needs a public way to agree which valid spend came first, without delegating the entire ledger to one company.",
    details: [
      "The original design starts with a peer-to-peer payment system instead of a trusted middleman.",
      "Participants need a shared history so the same value cannot be accepted twice.",
      "The goal is cryptographic proof and independently verifiable rules, not blind trust.",
    ],
    icon: CircleDollarSign,
    signal: "Question: how can strangers agree on one order of events?",
  },
  {
    id: "ownership",
    index: "02",
    label: "Ownership",
    title: "Keys authorize a transfer. They do not create an account at a bank.",
    summary:
      "Bitcoin uses digital signatures to demonstrate that the holder of a private key authorized a transaction. Public keys let others verify that authorization without seeing the private key.",
    details: [
      "A private key is the control mechanism; it must never be shared.",
      "A signature proves authorization for a specific transaction, not personal identity.",
      "Receiving an address does not give a counterparty the ability to spend from it.",
    ],
    icon: KeyRound,
    signal: "Rule: control of the key is control of the spending authority.",
  },
  {
    id: "network",
    index: "03",
    label: "Validation",
    title: "Independent nodes check the same rules before accepting a payment.",
    summary:
      "Transactions are broadcast across the network. Nodes validate the signatures and check that inputs have not already been spent before accepting a proposed block.",
    details: [
      "Nodes do not need to know or trust the sender to evaluate the rules.",
      "A block is rejected when it includes invalid or already-spent value.",
      "The network is resilient because many independent machines can verify the same data.",
    ],
    icon: Network,
    signal: "Rule: validation is distributed, not delegated to one operator.",
  },
  {
    id: "work",
    index: "04",
    label: "Proof of work",
    title: "Proof of work makes rewriting the record expensive.",
    summary:
      "Miners compete to add valid blocks by expending computational work. Replacing an older block would require redoing its work and catching up with the chain that honest participants continue extending.",
    details: [
      "Finding valid proof takes work; checking it is comparatively simple.",
      "Each new block references the prior block, creating an ordered chain of history.",
      "The cost of changing old history grows as more blocks build on top of it.",
    ],
    icon: Blocks,
    signal: "Tradeoff: public verification, secured by costly computation.",
  },
  {
    id: "settlement",
    index: "05",
    label: "Settlement",
    title: "Confirmations strengthen confidence. They are not a customer-support reversal button.",
    summary:
      "When a transaction is included in a block and later blocks follow it, reversing that history becomes progressively harder. The appropriate number of confirmations depends on the context and risk of the payment.",
    details: [
      "A transfer should be checked carefully before it is signed and broadcast.",
      "More confirmations generally mean more accumulated work behind the transaction.",
      "Self-custody comes with responsibility for keys, backups and destination checks.",
    ],
    icon: ShieldCheck,
    signal: "Takeaway: finality is an economic and technical property, not a promise of convenience.",
  },
] as const;

const paymentSteps = [
  {
    label: "Authorize",
    detail: "The sender signs a specific transaction with a private key. The key stays private; the authorization can be checked publicly.",
    icon: KeyRound,
  },
  {
    label: "Broadcast",
    detail: "The proposed transaction travels to nodes, which independently test signatures and spending rules.",
    icon: Network,
  },
  {
    label: "Include",
    detail: "A miner includes valid transactions in a block and proves the required work for that block.",
    icon: Blocks,
  },
  {
    label: "Confirm",
    detail: "Later blocks extend the chain, adding more work behind the transaction and improving settlement confidence.",
    icon: BadgeCheck,
  },
] as const;

const quizChoices = [
  {
    id: "proof",
    label: "Proof of work and the chain built on top of a block.",
    correct: true,
    feedback:
      "Correct. Rewriting an old block means redoing its proof of work and the work of later blocks while the honest chain keeps moving.",
  },
  {
    id: "password",
    label: "A password held by one central payment company.",
    correct: false,
    feedback:
      "Not quite. Bitcoin is designed so independent nodes can validate the shared ledger without one company deciding the history.",
  },
  {
    id: "address",
    label: "Making a public address secret after a transaction is sent.",
    correct: false,
    feedback:
      "Not quite. An address helps receive value; it is not the mechanism that orders and secures the shared history.",
  },
] as const;

export function BitcoinLearningExperience() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [paymentStep, setPaymentStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const chapter = chapters[activeChapter];
  const activePayment = paymentSteps[paymentStep];
  const selectedAnswer = quizChoices.find((choice) => choice.id === quizAnswer);
  const ChapterIcon = chapter.icon;
  const ActivePaymentIcon = activePayment.icon;

  function selectPaymentStep(index: number) {
    setPaymentStep(index);
  }

  return (
    <div className="levi-bitcoin-page">
      <div className="levi-bitcoin-grid" aria-hidden="true" />

      <section className="levi-container levi-bitcoin-hero">
        <LeviReveal>
          <div className="levi-bitcoin-hero-copy">
            <Link href="/learn" className="levi-bitcoin-back-link">
              <ArrowLeft className="h-4 w-4" /> Back to Flow Adventures Learn
            </Link>
            <p className="levi-eyebrow mt-8">
              <Blocks className="h-3.5 w-3.5" /> Bitcoin field guide / Interactive module
            </p>
            <h1>
              Bitcoin, <span>explained from first principles.</span>
            </h1>
            <p>
              The original whitepaper rebuilt as an interactive learning path through
              its core ideas: authorization, shared validation, proof of work and
              settlement.
            </p>
            <div className="levi-bitcoin-hero-actions">
              <a href="#guided-explorer" className="levi-primary-button">
                Start the guided explorer <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#payment-walkthrough" className="levi-secondary-button">
                Walk a payment
              </a>
            </div>
            <p className="levi-bitcoin-source-note">
              Built from the original Bitcoin system concepts published in 2008. Educational material only; not investment advice.
            </p>
          </div>
        </LeviReveal>

        <LeviReveal>
          <div className="levi-bitcoin-hero-map" aria-label="Bitcoin system overview">
            <div className="levi-bitcoin-map-topline">
              <span>One shared record</span>
              <span>Five ideas</span>
            </div>
            <div className="levi-bitcoin-map-nodes">
              {chapters.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`levi-bitcoin-map-node ${activeChapter === index ? "is-active" : ""}`}
                    onClick={() => setActiveChapter(index)}
                    aria-label={`Open chapter ${item.index}: ${item.label}`}
                  >
                    <span>{item.index}</span>
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
            <div className="levi-bitcoin-map-readout">
              <span>{chapter.index} / {chapter.label}</span>
              <strong>{chapter.signal}</strong>
            </div>
          </div>
        </LeviReveal>
      </section>

      <section id="guided-explorer" className="levi-container levi-bitcoin-section">
        <LeviReveal>
          <div className="levi-bitcoin-section-heading">
            <div>
              <p className="levi-section-label"><Network className="h-3.5 w-3.5" /> Guided explorer</p>
              <h2>Read the system one rule at a time.</h2>
              <p>
                Select a chapter to change the model. The goal is not to memorize jargon;
                it is to understand what each layer contributes to the whole network.
              </p>
            </div>
            <span className="levi-bitcoin-progress">{activeChapter + 1} of {chapters.length}</span>
          </div>
        </LeviReveal>

        <div className="levi-bitcoin-explorer">
          <div className="levi-bitcoin-chapter-list" role="tablist" aria-label="Bitcoin learning chapters">
            {chapters.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeChapter;
              return (
                <button
                  type="button"
                  key={item.id}
                  id={`bitcoin-tab-${item.id}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`bitcoin-panel-${item.id}`}
                  tabIndex={active ? 0 : -1}
                  className={`levi-bitcoin-chapter-button ${active ? "is-active" : ""}`}
                  onClick={() => setActiveChapter(index)}
                >
                  <span>{item.index}</span>
                  <Icon className="h-4 w-4" />
                  <strong>{item.label}</strong>
                </button>
              );
            })}
          </div>

          <div
            id={`bitcoin-panel-${chapter.id}`}
            role="tabpanel"
            aria-labelledby={`bitcoin-tab-${chapter.id}`}
            className="levi-bitcoin-chapter-panel"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={chapter.id}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="levi-bitcoin-chapter-label">
                  <ChapterIcon className="h-5 w-5" /> Chapter {chapter.index}
                </div>
                <h3>{chapter.title}</h3>
                <p className="levi-bitcoin-chapter-summary">{chapter.summary}</p>
                <ul>
                  {chapter.details.map((detail) => (
                    <li key={detail}>
                      <Check className="h-4 w-4" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="levi-bitcoin-chapter-signal">
                  <TimerReset className="h-4 w-4" />
                  <span>{chapter.signal}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="payment-walkthrough" className="levi-bitcoin-band">
        <div className="levi-container levi-bitcoin-section">
          <LeviReveal>
            <div className="levi-bitcoin-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><WalletCards className="h-3.5 w-3.5" /> Payment walkthrough</p>
                <h2>Trace one payment from intent to confirmation.</h2>
                <p>Move through the steps. Each stage has a different job, and none of them requires a bank to keep the central ledger.</p>
              </div>
            </div>
          </LeviReveal>

          <LeviReveal>
            <div className="levi-bitcoin-payment">
              <div className="levi-bitcoin-payment-steps" aria-label="Payment stages">
                {paymentSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = index === paymentStep;
                  return (
                    <button
                      type="button"
                      key={step.label}
                      className={`levi-bitcoin-payment-step ${active ? "is-active" : ""}`}
                      onClick={() => selectPaymentStep(index)}
                      aria-pressed={active}
                    >
                      <span>0{index + 1}</span>
                      <Icon className="h-4 w-4" />
                      <strong>{step.label}</strong>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePayment.label}
                  className="levi-bitcoin-payment-readout"
                  initial={reducedMotion ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ActivePaymentIcon className="h-6 w-6" />
                  <div>
                    <span>Stage 0{paymentStep + 1}</span>
                    <h3>{activePayment.label}</h3>
                    <p>{activePayment.detail}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="levi-bitcoin-payment-controls">
                <button
                  type="button"
                  className="levi-secondary-button"
                  onClick={() => selectPaymentStep(paymentStep === 0 ? paymentSteps.length - 1 : paymentStep - 1)}
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  type="button"
                  className="levi-primary-button"
                  onClick={() => selectPaymentStep((paymentStep + 1) % paymentSteps.length)}
                >
                  Next stage <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </LeviReveal>
        </div>
      </section>

      <section className="levi-container levi-bitcoin-section">
        <LeviReveal>
          <div className="levi-bitcoin-section-heading compact-heading">
            <div>
              <p className="levi-section-label"><ShieldCheck className="h-3.5 w-3.5" /> Reality check</p>
              <h2>What the protocol does, and what it does not do for you.</h2>
            </div>
          </div>
        </LeviReveal>

        <div className="levi-bitcoin-reality-grid">
          <LeviReveal>
            <article>
              <span>Protocol guarantees</span>
              <h3>Rules can be verified by independent participants.</h3>
              <p>Bitcoin makes it possible to verify signatures, history and consensus rules through public software and data.</p>
            </article>
          </LeviReveal>
          <LeviReveal>
            <article>
              <span>Personal responsibility</span>
              <h3>The network cannot recover a leaked key or a mistyped destination.</h3>
              <p>Wallet safety, backups, scams, custody choices and personal risk still require careful human decisions.</p>
            </article>
          </LeviReveal>
          <LeviReveal>
            <article>
              <span>Market reality</span>
              <h3>Understanding the protocol is not a prediction of price.</h3>
              <p>Asset markets remain volatile. Research, position sizing and risk limits are separate from how the network works.</p>
            </article>
          </LeviReveal>
        </div>
      </section>

      <section className="levi-bitcoin-band">
        <div className="levi-container levi-bitcoin-section levi-bitcoin-quiz-section">
          <LeviReveal>
            <div className="levi-bitcoin-quiz-heading">
              <p className="levi-section-label"><CircleCheck className="h-3.5 w-3.5" /> Knowledge check</p>
              <h2>What makes changing older Bitcoin history progressively harder?</h2>
            </div>
          </LeviReveal>

          <div className="levi-bitcoin-quiz-options">
            {quizChoices.map((choice) => {
              const selected = quizAnswer === choice.id;
              return (
                <button
                  type="button"
                  key={choice.id}
                  className={`levi-bitcoin-quiz-option ${selected ? "is-selected" : ""} ${selected && choice.correct ? "is-correct" : ""}`}
                  onClick={() => setQuizAnswer(choice.id)}
                  aria-pressed={selected}
                >
                  <span>{choice.label}</span>
                  {selected ? <CircleCheck className="h-5 w-5" /> : null}
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {selectedAnswer ? (
              <motion.div
                className={`levi-bitcoin-quiz-feedback ${selectedAnswer.correct ? "is-correct" : ""}`}
                role="status"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong>{selectedAnswer.correct ? "You have it." : "Try the system model again."}</strong>
                <p>{selectedAnswer.feedback}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            className="levi-bitcoin-reset"
            onClick={() => setQuizAnswer(null)}
            disabled={!quizAnswer}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset answer
          </button>
        </div>
      </section>

      <section className="levi-container levi-bitcoin-close">
        <LeviReveal>
          <p className="levi-section-label"><BadgeCheck className="h-3.5 w-3.5" /> Keep learning</p>
          <h2>Use protocol knowledge as context, then keep your own judgment active.</h2>
          <p>
            This module is a starting point for understanding Bitcoin&apos;s system design.
            Return to Flow Adventures Learn for the practical discipline, liquidity and risk material
            that belongs alongside any market research.
          </p>
          <Link href="/learn" className="levi-secondary-button mt-7">
            Return to Flow Adventures Learn <ArrowLeft className="h-4 w-4" />
          </Link>
        </LeviReveal>
      </section>
    </div>
  );
}
