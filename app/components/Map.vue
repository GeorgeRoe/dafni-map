<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { PartnerPoint } from '~/types/partnerPoint'
import { mapPartnerPointToFeature } from '~/utils/mapPointToFeature'
import { StakeholderType } from '~/types/stakeholderType'
import type { Partner } from '~/types/partner'
import { isPartner } from '~/utils/isPartner'

/**
 * Displays a map of partners.
 * 
 * - Receives partnerPoints as a prop
 * - Converts them into map features
 * - Shows them on a MapLibre map
 * - Groups nearby points into clusters
 * - Emits a click event when a partner is selected
 */

const props = withDefaults(defineProps<{
  partnerPoints?: PartnerPoint[]
  showAcademia: Boolean
}>(), {
  partnerPoints: () => []
})

const emit = defineEmits<{
  click: [Partner]
}>()

// Convert our PartnerPoint objects into GeoJSON features
// GeoJSON is the format MapLibre expects when displaying map data
const mablibreGlFeatures = computed(() => props.partnerPoints.map(mapPartnerPointToFeature))

// Reference to the <div> where MapLibre will render the map
const mapElement = useTemplateRef<HTMLElement>('map')

// Stores the MapLibre map instance after it is created
const map = shallowRef<maplibregl.Map | null>(null)

onMounted(() => {
  // Wait until the component has been rendered
  // MapLibre needs the map <div> to exist before creating the map
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
        } // This is just adding the background to our map - like here: https://maplibre.org/maplibre-gl-js/docs/examples/add-a-raster-tile-source/
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
        }
      ],
    },
    // Start the map roughly centered on the UK
    center: [-3, 54],
    zoom: 5,
  })

  map.value.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.value.on('load', async () => {
    if (map.value === null) return

    // Promise.all waits until every image has finished loading
    // before continuing. This prevents MapLibre trying to use
    // icons that have not been loaded yet.
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

    // Register all partner locations as a GeoJSON source.
    // Layers do not contain data themselves they read data from sources.
    map.value.addSource('point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mablibreGlFeatures.value,
      },
      // Cluster nearby points together when zoomed out
      cluster: true,
    })

    // Adding a layer that is the circle background behind every icon
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

    // Adding a layer to every feature with a point count and displays that number
    // These are the numbers inside the cluster circles
    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'point',
       // Only show this layer for clusters
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

    // These layers displays the stakeholder icon for each point
    Object.values(StakeholderType).forEach(stakeholderType => {
      map.value?.addLayer({
        id: `points-${stakeholderType}`,
        type: 'symbol',
        source: 'point',
        filter: [
          'all',
          // Ignore cluster markers
          ['!', ['has', 'cluster']],
          // Only show points that match this stakeholder type
          ['==', ['get', 'stakeholderType'], stakeholderType]
        ],
        layout: {
          'icon-image': stakeholderType,
          'icon-size': 0.1
        }
      })
    })
  })
  
  // When a marker background is clicked (all points including clusters):
  // 1. Get the clicked feature
  // 2. Check it is actually a Partner object (this is where clusters are excluded)
  // 3. Emit a click event so the parent component can react
  map.value.on('click', 'background', (e) => {
    if (!e.features || e.features.length === 0) return

    const clickedFeature = e.features[0]

    if (clickedFeature === undefined) return

    if (isPartner(clickedFeature.properties)) {
      emit('click', clickedFeature.properties)
    }
  })
})

// If the prop partnerPoints changes, update the map without rebuilding the entire MapLibre map.
watch(mablibreGlFeatures, (newFeatures) => {
  if (map.value === null) return

  const source = map.value.getSource('point')

  if (source !== undefined && isMaplibreglGeoJSONSource(source)) {
    // Replace the source data with the latest features.
    // Because the layers already use this source,
    // the map automatically redraws itself.
    (source as maplibregl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: newFeatures,
    })
  }
})

// Remove the map when the component is destroyed.
// This prevents memory leaks and removes event listeners.
onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<template>
  <div class="h-full w-full">
    <div class="relative isolate z-0 h-full w-full">
      <div
        id="map"
        ref="map"
        class="absolute inset-0 h-full w-full"
      />
    </div>
  </div>
</template>