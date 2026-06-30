<script setup lang="ts">
import partnerPointData from '~/assets/data/partnerPoints.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'
import type { Partner } from '~/types/partner'

const partnerPoints = useValidatedPoints(partnerPointData)

const slideoverOpen = ref(false)
const activePartner = ref<Partner | null>(null)

function onClick(partner: Partner) {
  activePartner.value = partner
  slideoverOpen.value = true
}
</script>

<template>
  <div class="h-[calc(100vh-var(--ui-header-height))]">
    
    <USlideover
      v-model:open="slideoverOpen"
      :modal="false"
      side="left"
      inset
      :ui="{
        content: 'top-[calc(1rem+var(--ui-header-height))]'
      }"
    >
      <template #content>
        <UButton
          color="neutral"
          variant="subtle"
          class="mb-4 w-fit m-2"
          icon="i-lucide-arrow-left"
          @click="slideoverOpen = false"
        />
        <h1 :style="{ fontSize:'30px'}">{{ activePartner.name }}</h1>
        <pre>{{ activePartner.stakeholderType  }}</pre>
      </template>
    </USlideover>
    <Map
      @click="onClick"
      :partner-points="partnerPoints"
    />
  </div>
</template>
