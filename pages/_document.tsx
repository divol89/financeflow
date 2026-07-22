import { Head, Html, Main, NextScript } from "next/document";
import { FLOW_THEME_BOOTSTRAP_SCRIPT } from "@/lib/flowFinance/theme";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="theme-color" content="#f4f8fc" />
        <script dangerouslySetInnerHTML={{ __html: FLOW_THEME_BOOTSTRAP_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
