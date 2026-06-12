<script setup lang="ts">
import partnerPointData from '~/assets/data/partnerPoints.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { Partner } from '~/types/partner'

const partnerPoints = useValidatedPoints(partnerPointData)

function onClick(partner: Partner) {
  console.log('Feature Clicked:', partner)
}
</script>

<template>
  <div class="h-[calc(100vh-var(--ui-header-height))]">
    <Map
      @click="onClick"
      :partner-points="partnerPoints"
    />
  </div>
</template>