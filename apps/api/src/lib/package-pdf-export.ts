import PDFDocument from "pdfkit";

export type PackagePdfSection = {
  id: string;
  title: string;
  enabled: boolean;
  content: unknown;
};

type PdfDoc = InstanceType<typeof PDFDocument>;

function writeLines(doc: PdfDoc, lines: string[]) {
  for (const line of lines) {
    doc.fontSize(11).text(line, { lineGap: 4 });
  }
}

function renderSectionContent(doc: PdfDoc, content: unknown) {
  if (content == null) {
    doc.fontSize(11).text("(No content)");
    return;
  }

  if (Array.isArray(content)) {
    if (content.length === 0) {
      doc.fontSize(11).text("(No content)");
      return;
    }
    if (typeof content[0] === "string") {
      writeLines(doc, content as string[]);
      return;
    }
    const rows = content as { phase?: string; duration?: string }[];
    for (const row of rows) {
      const label = row.phase ?? "Item";
      const detail = row.duration ?? "";
      doc.fontSize(11).text(`${label}${detail ? ` — ${detail}` : ""}`, { lineGap: 4 });
    }
    return;
  }

  if (typeof content === "object") {
    const obj = content as Record<string, unknown>;
    if (typeof obj.title === "string") {
      doc.fontSize(16).text(obj.title, { lineGap: 6 });
      if (typeof obj.subtitle === "string") {
        doc.fontSize(12).text(obj.subtitle, { lineGap: 4 });
      }
      return;
    }
    if (Array.isArray(obj.items)) {
      const items = obj.items as { description?: string; amount?: string }[];
      for (const item of items) {
        doc
          .fontSize(11)
          .text(`${item.description ?? "Item"}: ${item.amount ?? "—"}`, { lineGap: 4 });
      }
      if (typeof obj.total === "string") {
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total: ${obj.total}`, { lineGap: 4 });
      }
      return;
    }
    writeLines(
      doc,
      Object.entries(obj).map(([key, value]) => `${key}: ${String(value)}`),
    );
    return;
  }

  doc.fontSize(11).text(String(content));
}

export function generatePackagePdf(options: {
  bidName: string;
  recipient: string;
  projectType?: string | null;
  location?: string | null;
  sections: PackagePdfSection[];
}): Promise<Buffer> {
  const enabledSections = options.sections.filter((s) => s.enabled !== false);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(10).fillColor("#64748b").text("BidIntelligenceOS — Client Package", { align: "center" });
    doc.moveDown(0.5);
    doc.fillColor("#0f172a").fontSize(22).text(options.bidName, { align: "center" });
    doc.moveDown(0.25);
    doc.fontSize(12).fillColor("#475569").text(`Prepared for ${options.recipient || "Client"}`, {
      align: "center",
    });
    if (options.projectType || options.location) {
      doc.moveDown(0.25);
      const meta = [options.projectType, options.location].filter(Boolean).join(" · ");
      doc.fontSize(10).text(meta, { align: "center" });
    }
    doc.moveDown(1);
    doc
      .fontSize(9)
      .fillColor("#94a3b8")
      .text("Internal strategy and margin details are excluded from this export.", {
        align: "center",
      });

    for (const section of enabledSections) {
      doc.addPage();
      doc.fillColor("#0f172a").fontSize(16).text(section.title, { underline: true });
      doc.moveDown(0.75);
      renderSectionContent(doc, section.content);
    }

    if (enabledSections.length === 0) {
      doc.addPage();
      doc.fontSize(12).text("No enabled package sections to export.");
    }

    doc.end();
  });
}

export function packagePdfFilename(bidName: string, bidId: string): string {
  const slug = bidName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const base = slug || "bid-package";
  return `${base}-${bidId}.pdf`;
}
