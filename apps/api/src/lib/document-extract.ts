import { createRequire } from "node:module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text?: string }>;

const MAX_EXTRACT_CHARS = 48_000;

export type ExtractionResult = {
  text: string;
  status: "ready" | "metadata_only" | "failed";
  note: string;
};

export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<ExtractionResult> {
  const lower = fileName.toLowerCase();
  try {
    if (mimeType === "text/plain" || lower.endsWith(".txt") || lower.endsWith(".md")) {
      const text = buffer.toString("utf8").slice(0, MAX_EXTRACT_CHARS);
      return { text, status: "ready", note: "Plain text extracted." };
    }

    if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
      const parsed = await pdfParse(buffer);
      const text = (parsed.text ?? "").trim().slice(0, MAX_EXTRACT_CHARS);
      return {
        text,
        status: text.length > 40 ? "ready" : "metadata_only",
        note: text.length > 40 ? "PDF text extracted." : "PDF stored; limited text — reviewer may need manual review.",
      };
    }

    if (
      mimeType.includes("word") ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lower.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value ?? "").trim().slice(0, MAX_EXTRACT_CHARS);
      return {
        text,
        status: text.length > 40 ? "ready" : "metadata_only",
        note:
          text.length > 40
            ? "DOCX text extracted for ROSEOS scope analysis."
            : "DOCX stored; limited extractable text — reviewer should validate manually.",
      };
    }

    if (lower.endsWith(".doc")) {
      return {
        text: `Legacy .doc file on record: ${fileName}. Convert to DOCX or PDF for full AI extraction.`,
        status: "metadata_only",
        note: "Binary .doc not parsed — upload DOCX or PDF when possible.",
      };
    }

    return {
      text: `Attachment: ${fileName}`,
      status: "metadata_only",
      note: "Unsupported type for text extraction; file stored for human review.",
    };
  } catch (error) {
    return {
      text: "",
      status: "failed",
      note: error instanceof Error ? error.message : "Extraction failed",
    };
  }
}
