import type { GetServerSideProps } from "next";

export default function LegacyWhitepaperRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/docs",
    permanent: true,
  },
});
