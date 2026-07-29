import { Blocks, BrainCircuit, Eye, Lightbulb, type LucideIcon } from "lucide-react";

type NarrativeStep = {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const narrativeSteps: NarrativeStep[] = [
  {
    index: "01",
    title: "Observe",
    description: "Choose a token or wallet.",
    icon: Eye,
  },
  {
    index: "02",
    title: "Verify",
    description: "Confirm evidence and mint.",
    icon: BrainCircuit,
  },
  {
    index: "03",
    title: "Decide",
    description: "Choose your own next step.",
    icon: Lightbulb,
  },
  {
    index: "04",
    title: "Build",
    description: "Shape useful MULE utility.",
    icon: Blocks,
  },
];

export function HomeNarrativeFlow() {
  return (
    <ol className="levi-home-narrative-flow" aria-label="Bullish Mule product loop">
      {narrativeSteps.map(({ index, title, description, icon: Icon }) => (
        <li key={index}>
          <span>{index}</span>
          <strong>{title}</strong>
          <p>{description}</p>
          <div className="levi-home-narrative-icon" aria-hidden="true">
            <Icon className="h-5 w-5" strokeWidth={1.65} />
          </div>
        </li>
      ))}
    </ol>
  );
}
