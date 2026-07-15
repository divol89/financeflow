import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LeviCommunityLinks } from "../components/levi/LeviCommunityLinks";
import { LEVI_COMMUNITY_LINKS } from "../lib/levi/communityLinks";

test("publishes the official Telegram and X community destinations", () => {
  assert.deepEqual(
    LEVI_COMMUNITY_LINKS.map(({ href }) => href),
    ["https://t.me/FinanceFlowx", "https://x.com/WhiteBullAgent"]
  );

  const markup = renderToStaticMarkup(
    createElement(LeviCommunityLinks, { variant: "prominent" })
  );

  assert.match(markup, /https:\/\/t\.me\/FinanceFlowx/);
  assert.match(markup, /https:\/\/x\.com\/WhiteBullAgent/);
  assert.equal((markup.match(/target="_blank"/g) || []).length, 2);
  assert.equal((markup.match(/rel="noopener noreferrer"/g) || []).length, 2);
});
