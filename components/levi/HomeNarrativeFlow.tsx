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
    description: "Read public activity.",
    icon: Eye,
  },
  {
    index: "02",
    title: "Understand",
    description: "Surface useful context.",
    icon: BrainCircuit,
  },
  {
    index: "03",
    title: "Propose",
    description: "Share the next idea.",
    icon: Lightbulb,
  },
  {
    index: "04",
    title: "Build",
    description: "Ship useful utility.",
    icon: Blocks,
  },
];

export function HomeNarrativeFlow() {
  return (
    <ol className="levi-home-narrative-flow" aria-label="White Bull Agent development flow">
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
