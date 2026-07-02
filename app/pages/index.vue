<script setup lang="ts">
import partnerPointData from '~/assets/data/partnerPoints.json'
import { useValidatedPoints } from '~/composables/useValidatedPoints'
import type { Partner } from '~/types/partner'
import { StakeholderType } from '~/types/stakeholderType'

const partnerPoints = useValidatedPoints(partnerPointData)

const showAcademia = ref(true)
const showIndustry = ref(true)
const showGovernment = ref(true)

const filteredPartnerPoints = computed(() => {
  return partnerPoints.value.filter(point => {
    if (point.stakeholderType === StakeholderType.Government && showGovernment.value) return true
    if (point.stakeholderType === StakeholderType.Academia && showAcademia.value) return true
    if (point.stakeholderType === StakeholderType.Industry && showIndustry.value) return true
    return false
  })
})

const slideoverOpen = ref(false)
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
        <h1 class="toptext">{{ activePartner?.name }}</h1>
      </template>
        
      <template  #body>
        <div class="container">
          <img class="imageadjust" :src="'/partner_images/' + activePartner?.imageFilePath "/> 
          <a href="/${activePartner.project" target="_blank"class="middletext"> Project: {{ activePartner?.project }}</a>
          <h3 class="bottomtext">Description: {{ activePartner?.organisationDescription }}</h3>
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
    </UCard>
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
.container {
  display: flex;
  justify-content: center;
  flex-direction: column
}
</style>







