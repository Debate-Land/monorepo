import { createHash } from "crypto";

export function getHash(slug: string, end: number = 8) {
  return createHash('sha256')
    .update(slug)
    .digest('hex')
    .substring(0, end)
    ;
}
