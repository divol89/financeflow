import Head from "next/head";
import { BitcoinLearningExperience } from "@/components/levi/BitcoinLearningExperience";
import { LeviShell } from "@/components/levi/LeviShell";

export default function BitcoinLearningPage() {
  return (
    <LeviShell>
      <Head>
        <title>Bitcoin Field Guide | Flow Adventures Learn</title>
        <meta
          name="description"
          content="An interactive Flow Adventures guide to Bitcoin's original ideas: digital signatures, peer-to-peer validation, proof of work and confirmations."
        />
      </Head>
      <BitcoinLearningExperience />
    </LeviShell>
  );
}
