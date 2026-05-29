<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

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
        features: [
          ...[0, 1,2,3].map(i => ({
             type: 'Feature',
             geometry: {
               type: 'Point',
               coordinates: [-2.9395176240355627 + i * 0.005, 53.39556235424056 + i * 0.005]
             },
             properties: {
                id: `point-${i}`,
                name: `Point ${i}`
             }
          })) as any,
        ]
      },
      cluster: true,
    })

    map.value.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'point',
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

    console.log('Clicked feature:', clickedFeature)
  })
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