<script setup lang="ts">
import pointData from '~/assets/data/points.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'
import type { MapGeoJSONFeature } from 'maplibre-gl'

const points = useValidatedPoints(pointData)

function onClick(feature: MapGeoJSONFeature) {
  console.log('Feature Clicked:', feature)
}
</script>

<template>
  <div class="h-[calc(100vh-var(--ui-header-height))]">
    <Map
      @click="onClick"
      :points="points"
    />
  </div>
</template>