import crypto from "crypto";

const SECRET_KEY = process.env.ID_CARD_JWT_SECRET || process.env.APPWRITE_API_KEY || "vrps-production-sec-key-2026";

/**
 * Generates a tamper-proof HMAC SHA-256 signature for a given membership ID.
 */
export function generateVerificationSignature(membershipId: string): string {
  return crypto
    .createHmac("sha256", SECRET_KEY)
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
