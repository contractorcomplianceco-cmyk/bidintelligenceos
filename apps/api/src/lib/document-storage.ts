import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot =
  process.env.BIOS_UPLOADS_DIR ?? path.resolve(__dirname, "../../../../data/uploads");

const s3Bucket = process.env.BIOS_S3_BUCKET?.trim();
const s3Prefix = (process.env.BIOS_S3_PREFIX ?? "bios").replace(/^\/+|\/+$/g, "");
let s3Client: S3Client | null = null;

export function isS3StorageEnabled() {
  return Boolean(s3Bucket);
}

export function getUploadsRoot() {
  return uploadsRoot;
}

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.BIOS_S3_REGION ?? process.env.AWS_REGION ?? "us-east-1",
    });
  }
  return s3Client;
}

function objectKey(orgId: string, bidId: string, docId: string, safeName: string) {
  return `${s3Prefix}/${orgId}/${bidId}/${docId}_${safeName}`;
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export function bidUploadDir(orgId: string, bidId: string) {
  const dir = path.join(uploadsRoot, orgId, bidId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function writeBidDocumentFile(
  orgId: string,
  bidId: string,
  docId: string,
  fileName: string,
  buffer: Buffer,
) {
  const safeName = safeFileName(fileName);

  if (isS3StorageEnabled()) {
    const key = objectKey(orgId, bidId, docId, safeName);
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: key,
        Body: buffer,
        ContentType: "application/octet-stream",
      }),
    );
    return { storagePath: `s3://${s3Bucket}/${key}`, absolutePath: null as string | null };
  }

  const rel = path.join(orgId, bidId, `${docId}_${safeName}`);
  const abs = path.join(uploadsRoot, rel);
  bidUploadDir(orgId, bidId);
  fs.writeFileSync(abs, buffer);
  return { storagePath: rel, absolutePath: abs };
}

export async function readBidDocumentFile(storagePath: string): Promise<Buffer> {
  if (storagePath.startsWith("s3://")) {
    const without = storagePath.slice("s3://".length);
    const slash = without.indexOf("/");
    const bucket = without.slice(0, slash);
    const key = without.slice(slash + 1);
    const response = await getS3Client().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const bytes = await response.Body?.transformToByteArray();
    if (!bytes) throw new Error("S3 object empty");
    return Buffer.from(bytes);
  }

  const abs = path.join(uploadsRoot, storagePath);
  return fs.readFileSync(abs);
}
