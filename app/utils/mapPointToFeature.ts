import type { Feature, Point as GeoJsonPoint } from 'geojson'
import type { Point } from '~/types/point'

export function mapPointToFeature(point: Point): Feature<GeoJsonPoint, Pick<Point, 'name'>> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude]
    },
    properties: {
      name: point.name
    }
  }
}