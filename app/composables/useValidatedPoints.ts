import type { Point } from "~/types/point"
import typia from 'typia'

export function useValidatedPoints(points: MaybeRefOrGetter<unknown>) {
  return computed<Point[]>(() => {
    const validation = typia.validate<Point[]>(toValue(points))

    if (validation.success) {
      return validation.data
    } else {
      throw createError({
        message: "Invalid points data"
      })
    }
  })
}