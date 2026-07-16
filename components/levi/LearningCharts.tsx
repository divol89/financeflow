import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Droplets,
  Waves,
} from "lucide-react";

export function MarketCycleChart() {
  return (
    <div
      className="levi-learning-chart levi-learning-cycle-chart"
      role="img"
      aria-label="Illustrative memecoin market cycle showing attention, expansion, distribution and reset"
    >
      <div className="levi-learning-chart-topline">
        <span>Illustrative market cycle</span>
        <span>Not a forecast</span>
      </div>
      <div className="levi-learning-cycle-plot">
        <div className="levi-learning-chart-y-axis" aria-hidden="true">
          <span>attention</span>
          <span>price</span>
          <span>liquidity</span>
        </div>
        <div className="levi-learning-cycle-grid" aria-hidden="true" />
        <div className="levi-learning-cycle-area" aria-hidden="true" />
        <div className="levi-learning-cycle-line" aria-hidden="true" />
        <div className="levi-learning-cycle-marker marker-attention">
          <span>01</span>
          <strong>Attention</strong>
        </div>
        <div className="levi-learning-cycle-marker marker-expansion">
          <span>02</span>
          <strong>Expansion</strong>
        </div>
        <div className="levi-learning-cycle-marker marker-distribution">
          <span>03</span>
          <strong>Distribution</strong>
        </div>
        <div className="levi-learning-cycle-marker marker-reset">
          <span>04</span>
          <strong>Reset</strong>
        </div>
      </div>
      <div className="levi-learning-chart-caption">
        Attention can arrive faster than liquidity. Price can rise while the exit gets harder.
      </div>
    </div>
  );
}

export function RealizedProfitChart() {
  return (
    <div
      className="levi-learning-chart levi-learning-profit-chart"
      role="img"
      aria-label="Illustration comparing holding without taking profits to realizing gains in phases"
    >
      <div className="levi-learning-chart-topline">
        <span>Unrealized vs realized</span>
        <span>Illustrative units</span>
      </div>
      <div className="levi-learning-profit-grid">
        <div className="levi-learning-profit-column">
          <div className="levi-learning-profit-title">
            <ArrowDownRight className="h-4 w-4 text-rose-300" />
            <span>Hold only</span>
          </div>
          <div className="levi-learning-bars bars-round-trip" aria-hidden="true">
            <span style={{ height: "25%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "88%" }} />
            <span style={{ height: "100%" }} />
            <span style={{ height: "38%" }} />
            <span style={{ height: "8%" }} />
          </div>
          <p>Peak value exists on screen, but no gain was secured.</p>
        </div>
        <div className="levi-learning-profit-column">
          <div className="levi-learning-profit-title">
            <ArrowUpRight className="h-4 w-4 text-amber-300" />
            <span>Operate in phases</span>
          </div>
          <div className="levi-learning-bars bars-realized" aria-hidden="true">
            <span style={{ height: "25%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "62%" }} />
            <span style={{ height: "72%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "36%" }} />
          </div>
          <p>Some value is realized while a smaller core remains exposed.</p>
        </div>
      </div>
      <div className="levi-learning-chart-caption">
        Realized profit is not the same as abandoning a project. It is risk management.
      </div>
    </div>
  );
}

export function PositionLoopDiagram() {
  const steps = [
    { icon: CircleDollarSign, label: "Define risk", detail: "Size the position before emotion arrives." },
    { icon: ArrowUpRight, label: "Secure gains", detail: "Sell portions at pre-defined levels." },
    { icon: Droplets, label: "Keep liquidity", detail: "Leave room for exits without forcing price." },
    { icon: Waves, label: "Compound", detail: "Reinvest only when the thesis still holds." },
  ];

  return (
    <div className="levi-learning-loop" aria-label="Four-step operating loop">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="levi-learning-loop-step">
            <div className="levi-learning-loop-index">0{index + 1}</div>
            <div className="levi-learning-loop-icon"><Icon className="h-4 w-4" /></div>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        );
      })}
      <BarChart3 className="levi-learning-loop-mark" aria-hidden="true" />
    </div>
  );
}
