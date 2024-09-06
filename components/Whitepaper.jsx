const Whitepaper = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-flow-gradient">
        Flow Finance: Revolutionizing DeFi Voting and Token Acquisition
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">Introduction</h2>
          <p className="text-lg leading-relaxed">
            Flow Finance is at the forefront of decentralized finance (DeFi) innovation,
            introducing a groundbreaking approach to community-driven token acquisition
            and reward distribution. By leveraging smart contract technology and
            collective decision-making, Flow Finance aims to empower users to
            participate in exciting token opportunities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">Vote Funding</h2>
          <p className="text-lg leading-relaxed">
            Unlock the Power of Collective Decision-Making with Vote Funding. Our platform
            harnesses the wisdom of the crowd to determine which tokens to acquire.
            By participating in Vote Funding, you become part of a community-led initiative
            that ensures transparency and democratic decision-making in token selection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">PumpMeSir Functionality</h2>
          <p className="text-lg leading-relaxed">
            PumpMeSir is our innovative smart contract that enables community-driven
            token acquisition and reward distribution. Here&apos;s how it works:
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-cyan-200">Voting Mechanism</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Users can vote for their preferred tokens by sending IOTA to the contract.</li>
            <li>Each vote requires a minimum contribution of 0.001 IOTA.</li>
            <li>10% of each vote is allocated to marketing and development wallets.</li>
            <li>The remaining 90% contributes to the token acquisition fund.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-cyan-200">Token Acquisition</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>When the contract balance reaches a predefined threshold, voting ends.</li>
            <li>The token with the most votes is selected as the winning token.</li>
            <li>The contract automatically purchases the winning token using accumulated IOTA.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-cyan-200">Reward Distribution</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>50% of the acquired tokens are distributed as rewards to voters.</li>
            <li>Rewards are proportional to each user&apos;s contribution during the voting round.</li>
            <li>Users can claim their rewards after each round concludes.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-cyan-200">Multiple Rounds and Staking</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>The contract supports multiple voting rounds, allowing for ongoing participation.</li>
            <li>A staking mechanism is integrated, enabling further utility for acquired tokens.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">Benefits and Possibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Community-Driven Token Discovery: Participate in identifying promising tokens.</li>
            <li>Potential for Rewards: Earn a share of the acquired tokens based on your contributions.</li>
            <li>Automated Execution: Smart contract ensures transparent and fair execution of votes and purchases.</li>
            <li>Multiple Participation Opportunities: Engage in various rounds to diversify your token exposure.</li>
            <li>Staking Integration: Possibility to stake acquired tokens for additional benefits.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-cyan-300">Conclusion</h2>
          <p className="text-lg leading-relaxed">
            Flow Finance, through its PumpMeSir functionality, offers a unique and
            engaging way to participate in token acquisition and community-driven
            decision-making. By combining voting, automated purchasing, and reward
            distribution, we&apos;re creating new opportunities in the DeFi space.
            Join us in this exciting journey of collective token discovery and potential rewards.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Whitepaper;
