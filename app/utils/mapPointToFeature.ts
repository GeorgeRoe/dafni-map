import type { Feature, Point } from 'geojson'
import type { PartnerPoint } from '~/types/partnerPoint'
import type { Partner } from '~/types/partner'

export function mapPartnerPointToFeature(point: PartnerPoint): Feature<Point, Partner> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude]
    },
    properties: {
      name: point.name,
      stakeholderType: point.stakeholderType,
      organisationDescription: point.organisationDescription,
      imageFilePath: point.imageFilePath,
      project: point.project
    }
  }
}