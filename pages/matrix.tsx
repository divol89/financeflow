import Head from "next/head";

export default function MatrixDashboardPage() {
  const dashboardVersion = "20260602-live-proxy-v2";
  return (
    <>
      <Head>
        <title>IO Local Bot Cockpit - Flow Finance</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="min-h-screen bg-black">
        <iframe
          src={`/matrix-dashboard/index.html?v=${dashboardVersion}`}
          title="IO Local Bot Cockpit"
          className="h-screen w-full border-0"
          referrerPolicy="same-origin"
        />
      </main>
    </>
  );
}
