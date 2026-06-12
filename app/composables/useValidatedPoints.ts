import type { PartnerPoint } from "~/types/partnerPoint"
import typia from 'typia'

/**
 * Validates that the provided data is an array of Point objects.
 *
 * TypeScript only checks types while developing.
 * This validation runs at runtime to make sure the actual data
 * matches the PartnerPoint[] structure we expect.
 */

export function useValidatedPoints(points: MaybeRefOrGetter<unknown>) {
  return computed<PartnerPoint[]>(() => {
    const validation = typia.validate<PartnerPoint[]>(toValue(points))

    if (validation.success) {
      return validation.data
    } else {
      throw createError({
        message: "Invalid points data"
      })
    }
  })
}