import type { GetServerSideProps } from "next";

export default function LegacyTokenGateRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/portfolio?access=1",
    permanent: true,
  },
});
