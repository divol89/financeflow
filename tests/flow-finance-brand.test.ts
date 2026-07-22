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

test("publishes the token-neutral Flow-Finance Adventures identity", () => {
  assert.equal(FLOW_FINANCE_NAME, "Flow-Finance Adventures");
  for (const path of [FLOW_FINANCE_IMAGE_PATH, FLOW_FINANCE_FAVICON_PATH, FLOW_FINANCE_FAVICON_PNG_PATH, FLOW_FINANCE_APPLE_TOUCH_ICON_PATH]) {
    assert.equal(existsSync(`public${path}`), true, `${path} must exist`);
  }
});
