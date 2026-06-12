import typia from "typia";
import type { Partner } from "~/types/partner";

export function isPartner(partner: unknown): partner is Partner {
  return typia.is<Partner>(partner)
}