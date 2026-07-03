<script setup lang="ts">
import partnerPointData from '~/assets/data/partnerPoints.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'
import type { Partner } from '~/types/partner'
import { StakeholderType } from '~/types/stakeholderType'

const partnerPoints = useValidatedPoints(partnerPointData)

const showAcademia = ref(true)
const showIndustry = ref(true)
const showGovernment = ref(true)
const showCrossEU = ref(true)
const showOpenLand = ref(true)
const showUrbanAir = ref(true)

const filteredPartnerPoints = computed(() => {
  return partnerPoints.value.filter(point => {
    if (point.stakeholderType === StakeholderType.Government && showGovernment.value) {
      if (point.project === "Urban Air" && showUrbanAir.value)return true
      if (point.project === "OpenLAND" && showOpenLand.value)return true
      if (point.project === "CrossEU" && showCrossEU.value)return true}

    if (point.stakeholderType === StakeholderType.Academia && showAcademia.value) {
    if (point.project === "Urban Air" && showUrbanAir.value)return true
      if (point.project === "OpenLAND" && showOpenLand.value)return true
      if (point.project === "CrossEU" && showCrossEU.value)return true}

    if (point.stakeholderType === StakeholderType.Industry && showIndustry.value) {
      if (point.project === "Urban Air" && showUrbanAir.value)return true
      if (point.project === "OpenLAND" && showOpenLand.value)return true
      if (point.project === "CrossEU" && showCrossEU.value)return true}
    return false
  })
})


const slideoverOpen = ref(false)
var links = "place"
function closeSlideover() {
  slideoverOpen.value = false
}
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
          @click="closeSlideover"
        />
        <h1 class="relative text-5xl ml-8">{{ activePartner?.name }}</h1>
      </template>
        
      <template  #body>
        <div v-if="activePartner" class="container">
          <Image class="imageadjust" :src="'partner_images/' + activePartner.imageFilePath" /> 
          <h2 class="relative text-4xl ml-8 mb-4">Project: {{ activePartner.project }}</h2>
          <p class="relative text-2xl ml-8">Description: {{ activePartner.organisationDescription }}</p>
          <UButton
            class="class=relative text-2xl ml-3"
            icon="i-lucide-link"
            variant="link"
            :to="`/${activePartner.project}`"
          >
            visit {{activePartner.project}} page
          </UButton>
        </div>
      </template>
    </USlideover>

    <Map
      @click="onClick"
      :partner-points="filteredPartnerPoints"
    />

    <UCard class="absolute right-4 top-1/2 -translate-y-1/2">
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2"
        label="Show Academia"
        v-model="showAcademia"
      />
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2"
        label="Show Government"
        v-model="showGovernment"
      />
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2"
        label="Show Industry"
        v-model="showIndustry"
      />
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2 mt-10"
        label="Show CrossEU"
        v-model="showCrossEU"
      />
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2"
        label="Show OpenLand"
        v-model="showOpenLand"
      />
      <UCheckbox
        color="neutral"
        class="mb-4 w-fit m-2"
        label="Show Urban Air"
        v-model="showUrbanAir"
        />
    </UCard>
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column
}
</style>







