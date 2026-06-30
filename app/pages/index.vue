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
   
        <h1 class="toptext">{{ activePartner?.name }}</h1>
        <h2 class="middletext">{{ activePartner?.project }}</h2>
        <h3 class="bottomtext">{{ activePartner?.organisationDescription }}</h3>
        <img :src="'/partner_images/' + activePartner?.imageFilePath "/> 
      </template>

   
    </USlideover>
    <Map
      @click="onClick"
      :partner-points="partnerPoints"
    />
  </div>
</template>


<style>
.middletext {
  position: relative;
  top: -70px;
  font-Size: 35px;
  inset-inline-start: 5px;
}
.toptext {
  position: relative;
  top: 0px;
  font-Size: 45px;
  inset-inline-start: 5px;
}
.bottomtext {
  position: relative;
  top:  -20px;
  font-Size: 25px;
  inset-inline-start: 5px;
}
</style>







