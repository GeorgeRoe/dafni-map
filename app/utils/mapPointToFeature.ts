import type { Feature, Point as GeoJsonPoint } from 'geojson'
import { StakeholderType, type Point } from '~/types/point'

export function mapPointToFeature(point: Point): Feature<GeoJsonPoint, Pick<Point, 'name' | 'stakeholderType'>> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude]
    },
    properties: {
      name: point.name,
      stakeholderType: point.stakeholderType
    }
  }
}