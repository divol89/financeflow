import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Radar, Rocket } from "lucide-react";
import {
  BULLISH_MULE_DISCIPLINE_IMAGE_PATH,
  BULLISH_MULE_ROCKET_IMAGE_PATH,
  BULLISH_MULE_TERMINAL_IMAGE_PATH,
} from "@/lib/bullishMule/brand";

const stories = [
  {
    image: BULLISH_MULE_TERMINAL_IMAGE_PATH,
    alt: "Bullish Mule studying market screens",
    eyebrow: "Research",
    title: "Read the chain, not the noise.",
    body: "Use wallet activity, token evidence and visible coverage to form a view without pretending a heuristic can predict intent.",
    href: "/scanner",
    action: "Open Scanner",
    icon: Radar,
  },
  {
    image: BULLISH_MULE_DISCIPLINE_IMAGE_PATH,
    alt: "Bullish Mule training with discipline",
    eyebrow: "Discipline",
    title: "Build a process before a position.",
    body: "Learn how liquidity, realized gains, concentration and written rules can matter more than emotional conviction.",
    href: "/learn",
    action: "Open Learn",
    icon: GraduationCap,
  },
  {
    image: BULLISH_MULE_ROCKET_IMAGE_PATH,
    alt: "Bullish Mule riding a MULE rocket",
    eyebrow: "Participation",
    title: "See supported launches without an embedded buy button.",
    body: "MULE holders can inspect published mints and official sources, then decide independently whether to participate elsewhere.",
    href: "/fair-launches",
    action: "Open Launchpad",
    icon: Rocket,
  },
] as const;

export function MuleEditorialStory() {
  return (
    <section className="mule-story" aria-labelledby="mule-story-title">
      <header className="flow-section-heading">
        <div>
          <p className="flow-kicker">The MULE operating code</p>
          <h2 id="mule-story-title">Focus. Verify. Decide.</h2>
          <p>
            Bullish energy is not blind optimism. It is a repeatable habit of
            checking evidence, managing exposure and acting with intent.
          </p>
        </div>
      </header>

      <div className="mule-story-grid">
        {stories.map(({ image, alt, eyebrow, title, body, href, action, icon: Icon }) => (
          <article key={title} className="mule-story-item">
            <div className="mule-story-media">
              <Image src={image} alt={alt} fill sizes="(max-width: 767px) 100vw, 33vw" />
            </div>
            <div className="mule-story-copy">
              <span>{eyebrow}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link href={href}>
                <Icon className="h-4 w-4" /> {action}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
