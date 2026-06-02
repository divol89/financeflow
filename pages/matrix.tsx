import Head from "next/head";

export default function MatrixDashboardPage() {
  return (
    <>
      <Head>
        <title>IO Local Bot Cockpit - Flow Finance</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="min-h-screen bg-black">
        <iframe
          src="/matrix-dashboard/index.html"
          title="IO Local Bot Cockpit"
          className="h-screen w-full border-0"
          referrerPolicy="same-origin"
        />
      </main>
    </>
  );
}
