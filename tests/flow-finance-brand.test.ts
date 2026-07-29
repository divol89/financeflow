import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import {
  FLOW_FINANCE_APPLE_TOUCH_ICON_PATH,
  FLOW_FINANCE_FAVICON_PATH,
  FLOW_FINANCE_FAVICON_PNG_PATH,
  FLOW_FINANCE_IMAGE_PATH,
  FLOW_FINANCE_NAME,
} from "../lib/flowFinance/brand";

test("keeps legacy brand imports aligned with Bullish Mule", () => {
  assert.equal(FLOW_FINANCE_NAME, "Bullish Mule");
  for (const path of [FLOW_FINANCE_IMAGE_PATH, FLOW_FINANCE_FAVICON_PATH, FLOW_FINANCE_FAVICON_PNG_PATH, FLOW_FINANCE_APPLE_TOUCH_ICON_PATH]) {
    assert.equal(existsSync(`public${path}`), true, `${path} must exist`);
  }
});
