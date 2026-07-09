import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { PackagePdfSection } from "./package-pdf-export.js";

function textParagraph(
  text: string,
  options?: { bold?: boolean; size?: number; color?: string; pageBreakBefore?: boolean },
) {
  return new Paragraph({
    pageBreakBefore: options?.pageBreakBefore,
    children: [
      new TextRun({
        text,
        bold: options?.bold,
        size: options?.size,
        color: options?.color,
      }),
    ],
  });
}

function contentToBlocks(content: unknown): Paragraph[] {
  if (content == null) {
    return [textParagraph("(No content)")];
  }

  if (Array.isArray(content)) {
    if (content.length === 0) {
      return [textParagraph("(No content)")];
    }
    if (typeof content[0] === "string") {
      return (content as string[]).map((line) => textParagraph(line));
    }
    const rows = content as { phase?: string; duration?: string }[];
    return rows.map((row) => {
      const label = row.phase ?? "Item";
      const detail = row.duration ?? "";
      return textParagraph(`${label}${detail ? ` — ${detail}` : ""}`);
    });
  }

  if (typeof content === "object") {
    const obj = content as Record<string, unknown>;
    if (typeof obj.title === "string") {
      const blocks: Paragraph[] = [
        new Paragraph({
          text: obj.title,
          heading: HeadingLevel.HEADING_2,
        }),
      ];
      if (typeof obj.subtitle === "string") {
        blocks.push(textParagraph(obj.subtitle, { size: 24 }));
      }
      return blocks;
    }
    if (Array.isArray(obj.items)) {
      const items = obj.items as { description?: string; amount?: string }[];
      const blocks = items.map((item) =>
        textParagraph(`${item.description ?? "Item"}: ${item.amount ?? "—"}`),
      );
      if (typeof obj.total === "string") {
        blocks.push(textParagraph(`Total: ${obj.total}`, { bold: true, size: 24 }));
      }
      return blocks;
    }
    return Object.entries(obj).map(([key, value]) => textParagraph(`${key}: ${String(value)}`));
  }

  return [textParagraph(String(content))];
}

export async function generatePackageDocx(options: {
  bidName: string;
  recipient: string;
  projectType?: string | null;
  location?: string | null;
  sections: PackagePdfSection[];
}): Promise<Buffer> {
  const enabledSections = options.sections.filter((s) => s.enabled !== false);

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "BidIntelligenceOS — Client Package", color: "64748B", size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: options.bidName, bold: true, size: 44 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Prepared for ${options.recipient || "Client"}`,
          color: "475569",
          size: 24,
        }),
      ],
    }),
  ];

  if (options.projectType || options.location) {
    const meta = [options.projectType, options.location].filter(Boolean).join(" · ");
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: meta, color: "475569", size: 20 })],
      }),
    );
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Internal strategy and margin details are excluded from this export.",
          color: "94A3B8",
          size: 18,
          italics: true,
        }),
      ],
    }),
  );

  if (enabledSections.length === 0) {
    children.push(textParagraph("No enabled package sections to export.", { pageBreakBefore: true }));
  } else {
    for (const section of enabledSections) {
      children.push(
        new Paragraph({
          pageBreakBefore: true,
          text: section.title,
          heading: HeadingLevel.HEADING_1,
        }),
      );
      children.push(...contentToBlocks(section.content));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(doc);
}

export function packageDocxFilename(bidName: string, bidId: string): string {
  const slug = bidName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const base = slug || "bid-package";
  return `${base}-${bidId}.docx`;
}
