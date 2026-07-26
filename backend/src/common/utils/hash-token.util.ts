import { createHash, timingSafeEqual } from "crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string, hashedToken: string): boolean {
  const incoming = Buffer.from(hashToken(token), "hex");
  const stored = Buffer.from(hashedToken, "hex");

  return (
    incoming.length === stored.length && timingSafeEqual(incoming, stored)
  );
}
