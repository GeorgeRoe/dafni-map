<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Point } from '~/types/point'
import { mapPointToFeature } from '~/utils/mapPointToFeature'

const props = withDefaults(defineProps<{
  points?: Point[]
}>(), {
  points: () => []
})

const emit = defineEmits<{
  click: [maplibregl.MapGeoJSONFeature]
}>()

const mablibreGlFeatures = computed(() => props.points.map(mapPointToFeature))

const mapElement = useTemplateRef<HTMLElement>('map')
const map = shallowRef<maplibregl.Map | null>(null)

onMounted(() => {
  if (!mapElement.value) return

  map.value = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 19,
          attribution: "© OpenStreetMap contributors",
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
        }
      ],
    },
    center: [-3, 54],
    zoom: 5,
  })

  map.value.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.value.on('load', async () => {
    if (map.value === null) return

    const image = await map.value.loadImage('/rustacean.png')
    map.value.addImage('custom-marker', image.data)

    map.value.addSource('point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mablibreGlFeatures.value,
      },
      cluster: true,
    })

    map.value.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'point',
      filter: ['has', 'cluster'], // Only applies to grouped features
      paint: {
        'circle-color': '#555555',
        'circle-radius': 20,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })

    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'point',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Regular'],
        'text-size': 20
      },
      paint: {
        'text-color': '#ffffff' 
      }
    })

    map.value.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'point',
      filter: ['!', ['has', 'cluster']], // Only applies to individual points
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.175
      }
    })
  })

  map.value.on('click', 'points', (e) => {
    if (!e.features || e.features.length === 0) return

    const clickedFeature = e.features[0]

    if (clickedFeature === undefined) return

    emit('click', clickedFeature)
  })
})

watch(mablibreGlFeatures, (newFeatures) => {
  if (map.value === null) return

  const source = map.value.getSource('point')

  if (source !== undefined && isMaplibreglGeoJSONSource(source)) {
    (source as maplibregl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: newFeatures,
    })
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<template>
  <div class="relative isolate z-0 h-full w-full">
    <div
      id="map"
      ref="map"
      class="absolute inset-0 h-full w-full"
    />
  </div>
</template>