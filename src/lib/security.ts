import crypto from "crypto";

function getSecretKey(): string {
  const secret = process.env.ID_CARD_JWT_SECRET || process.env.APPWRITE_API_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL SECURITY WARNING: ID_CARD_JWT_SECRET or APPWRITE_API_KEY is not configured in production environment! Using fallback key constitutes a fail-open security risk under DPDP Act technical safeguard mandates."
      );
    }
    return "vrps-production-sec-key-2026";
  }
  return secret;
}

/**
 * Generates a tamper-proof HMAC SHA-256 signature for a given membership ID.
 */
export function generateVerificationSignature(membershipId: string): string {
  const key = getSecretKey();
  return crypto
    .createHmac("sha256", key)
    .update(`vrps_verify_${membershipId.trim().toUpperCase()}`)
    .digest("hex")
    .slice(0, 16); // 16-char hex signature for clean QR URLs
}

/**
 * Validates whether a provided signature matches the server-computed HMAC signature.
 */
export function verifyVerificationSignature(membershipId: string, signature?: string | null): boolean {
  if (!signature || !membershipId) return false;
  const expected = generateVerificationSignature(membershipId);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
