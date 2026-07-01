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
      <template #header>
        <UButton
          color="neutral"
          variant="subtle"
          class="mb-4 w-fit m-2"
          icon="i-lucide-arrow-left"
          @click="slideoverOpen = false"
          />
          <h1 class="toptext">{{ activePartner?.name }}</h1>
        </template>
        
      <template #body>
        <h2 class="middletext"> Project: {{ activePartner?.project }}</h2>
        <h3 class="bottomtext">Description: {{ activePartner?.organisationDescription }}</h3>
        <img class="imageadjust" :src="'/partner_images/' + activePartner?.imageFilePath "/> 
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

  font-Size: 35px;
  margin-left: 10px;
}
.toptext {
  position: relative;
  font-Size: 45px;
  margin-left: 10px;
}
.bottomtext {
  position: relative;

  font-Size: 25px;
  margin-left: 10px;
}
.imageadjust {
  position: absolute;
  text-align: center;
}
</style>







