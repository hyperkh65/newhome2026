import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../app/page";

test("메인 페이지가 서버 렌더링된다", async () => {
  const element = await HomePage();
  const html = renderToStaticMarkup(element);
  assert.match(html, /\(주\)와이앤케이/);
  assert.match(html, /제품 데이터/);
});
