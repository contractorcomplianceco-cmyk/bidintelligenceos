import { Router } from "express";
import multer from "multer";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { bidDocuments, bids } from "../../db/schema.js";
import { extractDocumentText } from "../../lib/document-extract.js";
import { writeBidDocumentFile } from "../../lib/document-storage.js";
import { nextId, nowIso } from "../../lib/ids.js";
import { requireAuth, type AuthedRequest } from "../../middleware/auth.js";
import { orgScopeMiddleware } from "../../middleware/org-scope.js";

const router = Router({ mergeParams: true });
router.use(orgScopeMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    const ok =
      /\.(pdf|txt|md|docx?)$/i.test(file.originalname) ||
      ["application/pdf", "text/plain", "text/markdown", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
        file.mimetype,
      );
    if (ok) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

function mapDocument(row: {
  id: string;
  bidId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  extractionStatus: string;
  extractedText: string | null;
  aiGenerated: boolean | null;
  humanReviewed: boolean | null;
  createdAt: string;
}) {
  return {
    id: row.id,
    bidId: row.bidId,
    fileName: row.fileName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    extractionStatus: row.extractionStatus,
    hasText: Boolean(row.extractedText && row.extractedText.length > 20),
    aiGenerated: Boolean(row.aiGenerated),
    humanReviewed: Boolean(row.humanReviewed),
    createdAt: row.createdAt,
  };
}

router.get("/", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bidId = String((req.params as { bidId?: string }).bidId ?? "");
  const db = getDb();
  const rows = await db
    .select()
    .from(bidDocuments)
    .where(
      and(eq(bidDocuments.bidId, bidId), eq(bidDocuments.orgId, orgId), isNull(bidDocuments.deletedAt)),
    );
  res.json({ documents: rows.map(mapDocument) });
});

router.post("/", upload.array("files", 8), async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bidId = String((req.params as { bidId?: string }).bidId ?? "");
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  const db = getDb();
  const bid = await db
    .select()
    .from(bids)
    .where(and(eq(bids.id, bidId), eq(bids.orgId, orgId), isNull(bids.deletedAt)))
    .limit(1);
  if (!bid[0]) {
    res.status(404).json({ error: "Bid not found" });
    return;
  }

  const ts = nowIso();
  const saved = [];

  for (const file of files) {
    const id = nextId("CCA-DOC");
    const { storagePath } = await writeBidDocumentFile(orgId, bidId, id, file.originalname, file.buffer);
    const extraction = await extractDocumentText(file.buffer, file.mimetype, file.originalname);

    await db.insert(bidDocuments).values({
      id,
      orgId,
      bidId,
      fileName: file.originalname,
      mimeType: file.mimetype || "application/octet-stream",
      sizeBytes: file.size,
      storagePath,
      extractedText: extraction.text || null,
      extractionStatus: extraction.status,
      aiGenerated: true,
      humanReviewed: false,
      createdAt: ts,
    });

    saved.push({
      id,
      fileName: file.originalname,
      extractionStatus: extraction.status,
      note: extraction.note,
    });
  }

  res.status(201).json({
    documents: saved,
    disclaimer: "Powered by AI. Reviewed by humans required before client-facing use.",
  });
});

router.delete("/:docId", async (req, res) => {
  const { orgId } = (req as unknown as AuthedRequest).auth;
  const bidId = String((req.params as { bidId?: string }).bidId ?? "");
  const docId = req.params.docId;
  const db = getDb();
  const rows = await db
    .select()
    .from(bidDocuments)
    .where(
      and(
        eq(bidDocuments.id, docId),
        eq(bidDocuments.bidId, bidId),
        eq(bidDocuments.orgId, orgId),
        isNull(bidDocuments.deletedAt),
      ),
    )
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Document not found" });
    return;
  }
  await db
    .update(bidDocuments)
    .set({ deletedAt: nowIso() })
    .where(eq(bidDocuments.id, docId));
  res.json({ ok: true });
});

export default router;
