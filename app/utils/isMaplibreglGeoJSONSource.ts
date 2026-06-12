import type { Source, GeoJSONSource } from "maplibre-gl"

export function isMaplibreglGeoJSONSource(source: Source): source is GeoJSONSource {
  return source.type === "geojson"
}
