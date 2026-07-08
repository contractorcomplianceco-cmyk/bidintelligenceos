import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { bidDocuments } from "../db/schema.js";

export async function getBidDocumentContext(bidId: string, orgId: string, maxChars = 24_000) {
  const db = getDb();
  const rows = await db
    .select()
    .from(bidDocuments)
    .where(
      and(
        eq(bidDocuments.bidId, bidId),
        eq(bidDocuments.orgId, orgId),
        isNull(bidDocuments.deletedAt),
      ),
    );

  const parts: string[] = [];
  let total = 0;
  for (const row of rows) {
    if (!row.extractedText) continue;
    const chunk = `--- ${row.fileName} ---\n${row.extractedText}`;
    if (total + chunk.length > maxChars) break;
    parts.push(chunk);
    total += chunk.length;
  }

  return {
    documentCount: rows.length,
    extractedCount: rows.filter((r) => r.extractionStatus === "ready").length,
    combinedText: parts.join("\n\n"),
  };
}
