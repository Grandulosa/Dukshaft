import crypto from "crypto"

/** Generates a cryptographically secure random hex token. */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/** Generates a 6-digit numeric verification code. */
export function generateVerificationCode(): string {
  return String(crypto.randomInt(100000, 999999))
}

/** SHA-256 hash of a token — store the hash, send the raw token. */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}
