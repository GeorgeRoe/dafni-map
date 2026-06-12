<script setup lang="ts">
import pointData from '~/assets/data/points.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'

const points = useValidatedPoints(pointData)
</script>

<template>
  <div>
    <div class="h-[calc(100vh-var(--ui-header-height))]">
      <Map :points="points" />
    </div>
  </div>
</template>