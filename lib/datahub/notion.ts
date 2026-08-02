import { createHash } from "node:crypto";

type NotionWriteTask = {
  databaseId: string;
  pageId?: string;
  payload: Record<string, unknown>;
  rawHash: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildRawHash(payload: unknown) {
  return createHash("sha1").update(JSON.stringify(payload)).digest("hex");
}

async function notionRequest(
  path: string,
  init: RequestInit,
  attempt = 0
): Promise<Response> {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN missing");
  }

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (response.status === 429 && attempt < 5) {
    const retryAfter = Number(response.headers.get("Retry-After") || 1);
    await sleep(retryAfter * 1000 * (attempt + 1));
    return notionRequest(path, init, attempt + 1);
  }

  return response;
}

export async function queueNotionWrites(tasks: NotionWriteTask[]) {
  const results: Array<{ ok: boolean; rawHash: string; status: number; body: string }> = [];
  for (const task of tasks) {
    const response = await notionRequest("/pages", {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: task.databaseId },
        properties: task.payload,
      }),
    });
    results.push({
      ok: response.ok,
      rawHash: task.rawHash,
      status: response.status,
      body: await response.text(),
    });
    await sleep(250);
  }
  return results;
}
