<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { PartnerPoint } from '~/types/partnerPoint'
import { mapPartnerPointToFeature } from '~/utils/mapPointToFeature'
import { StakeholderType } from '~/types/stakeholderType'
import type { Partner } from '~/types/partner'
import { isPartner } from '~/utils/isPartner'

const props = withDefaults(defineProps<{
  partnerPoints?: PartnerPoint[]
}>(), {
  partnerPoints: () => []
})

const emit = defineEmits<{
  click: [Partner]
}>()

const mablibreGlFeatures = computed(() => props.partnerPoints.map(mapPartnerPointToFeature))

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

    await Promise.all(
      Object.values(StakeholderType).map(async (stakeholderType) => {
        if (!map.value) return
        
        try {
          const image = await map.value.loadImage(`/icons/${stakeholderType}.png`)
          map.value.addImage(stakeholderType, image.data)
        } catch (error) {
          console.error(`Failed to load icon for: ${stakeholderType}`, error)
        }
      })
    )

    map.value.addSource('point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mablibreGlFeatures.value,
      },
      cluster: true,
    })

    map.value.addLayer({
      id: 'background',
      type: 'circle',
      source: 'point',
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

    Object.values(StakeholderType).forEach(stakeholderType => {
      map.value?.addLayer({
        id: `points-${stakeholderType}`,
        type: 'symbol',
        source: 'point',
        filter: [
          'all',
          ['!', ['has', 'cluster']], 
          ['==', ['get', 'stakeholderType'], stakeholderType]
        ],
        layout: {
          'icon-image': stakeholderType,
          'icon-size': 0.1
        }
      })
    })
  })

  map.value.on('click', 'background', (e) => {
    if (!e.features || e.features.length === 0) return

    const clickedFeature = e.features[0]

    if (clickedFeature === undefined) return

    if (isPartner(clickedFeature.properties)) {
      emit('click', clickedFeature.properties)
    }
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