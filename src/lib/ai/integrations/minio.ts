import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { aiConfig, isConfigured } from "../config";
import { logIntegration } from "./logger";

const memoryFiles = new Map<string, { contentType: string; data: Buffer | string }>();

function getS3(): S3Client | null {
  if (!aiConfig.minio.endpoint) return null;
  return new S3Client({
    region: "us-east-1",
    endpoint: `${aiConfig.minio.useSSL ? "https" : "http"}://${aiConfig.minio.endpoint}:${aiConfig.minio.port}`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: aiConfig.minio.accessKey,
      secretAccessKey: aiConfig.minio.secretKey,
    },
  });
}

async function ensureBucket(client: S3Client): Promise<void> {
  try {
    await client.send(new HeadBucketCommand({ Bucket: aiConfig.minio.bucket }));
  } catch {
    try {
      await client.send(new CreateBucketCommand({ Bucket: aiConfig.minio.bucket }));
    } catch {
      // bucket may already exist or MinIO unavailable
    }
  }
}

export async function uploadTextObject(
  key: string,
  content: string,
  contentType = "text/plain"
): Promise<string | undefined> {
  return uploadBufferObject(key, Buffer.from(content, "utf-8"), contentType);
}

export async function uploadBufferObject(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string | undefined> {
  memoryFiles.set(key, { contentType, data: buffer });

  const client = getS3();
  if (!client || !isConfigured(aiConfig.minio.accessKey)) {
    await logIntegration("minio", "upload_dry_run", "ok", { key, contentType, bytes: buffer.length });
    return `memory://${key}`;
  }

  try {
    await ensureBucket(client);
    await client.send(
      new PutObjectCommand({
        Bucket: aiConfig.minio.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
    const url = `${aiConfig.minio.useSSL ? "https" : "http"}://${aiConfig.minio.endpoint}:${aiConfig.minio.port}/${aiConfig.minio.bucket}/${key}`;
    await logIntegration("minio", "upload", "ok", { key }, { url });
    return url;
  } catch (error) {
    await logIntegration("minio", "upload", "error", { key }, {
      error: error instanceof Error ? error.message : "upload_failed",
    });
    return `memory://${key}`;
  }
}

export function getMemoryFile(key: string) {
  return memoryFiles.get(key);
}
