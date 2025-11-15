import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn("Cloudflare R2 environment variables are not fully configured.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: R2_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadImageToR2(params: {
  buffer: Buffer;
  contentType: string;
  folder?: string;
}): Promise<string> {
  const key = `${params.folder ?? "uploads"}/${randomUUID()}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
      ACL: "public-read",
    }),
  );

  // Public URL – adjust if you use a custom domain or public bucket URL.
  return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
}
