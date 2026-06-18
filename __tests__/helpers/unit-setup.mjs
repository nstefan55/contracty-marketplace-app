import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

// Intentionally load only the example file. The real .env.test on this
// developer's machine still holds live secrets — see the audit report.
config({ path: path.join(root, ".env.test.example") });

// Belt-and-braces: ensure required env vars exist even if .env.test is missing.
process.env.NODE_ENV ||= "test";
process.env.UPSTASH_REDIS_REST_URL ||= "https://test-upstash.example.com";
process.env.UPSTASH_REDIS_REST_TOKEN ||= "test-token";
process.env.RESEND_API_KEY ||= "test-resend-api-key";
process.env.GOOGLE_CLIENT_ID ||= "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET ||= "test-google-client-secret";
process.env.AUTH_SECRET ||= "test-secret-do-not-use-in-prod";
process.env.NEXTAUTH_SECRET ||= "test-secret-do-not-use-in-prod";
