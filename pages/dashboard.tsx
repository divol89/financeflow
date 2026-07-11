import type { GetServerSideProps } from "next";

export default function LegacyDashboardRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/portfolio",
    permanent: true,
  },
});
