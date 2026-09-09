import crypto from "crypto";

export function generateCode() {
  const orderCode = crypto.randomUUID().slice(0, 14);
  return `PAY-${orderCode}`;
}
