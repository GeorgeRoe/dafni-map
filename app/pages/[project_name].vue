<script setup lang="ts">
import projectData from '~/assets/data/project.json'
import partnerPointData from '~/pages/index.vue'
import { useValidatedPoints } from '~/composables/useValidatedPoints'

const route = useRoute()
const projectName = computed(() => route.params.project_name?.toString())

const selectedProject = computed(() => {
  return projectData.find(project => project.name === projectName.value)
})

const partnerPoints = useValidatedPoints(partnerPointData)
const filteredPartnerPoints = computed(() => {
  return partnerPoints.value.filter(point => {
    if (point.project === projectName.value) return true
    return false
  })
})
</script>


<template>
    <ul>
      <li v-for="partner in filteredPartnerPoints">
          {{ partner }}
      </li>
    </ul>
  <UContainer class="py-10">
    <UCard v-if="selectedProject" class="overflow-hidden">
      <div class="grid gap-4 md:grid-cols-2 items-center">
        <div>
          <h1 class="text-4xl font-bold tracking-tight mb-4">
            {{ selectedProject.name }}
          </h1>

          <p class="text-lg text-muted leading-relaxed">
            {{ selectedProject.description }}
          </p>
        </div>

        <div class="flex justify-center">
          <img
            :src="`/project_images/${selectedProject.imageFilePath}`"
            :alt="selectedProject.name"
            class="w-auto object-contain"
          />
        </div>
      </div>
    </UCard>

    <UAlert
      v-else
      color="error"
      variant="soft"
      title="Project not found"
      description="The requested project could not be found."
    />
  </UContainer>
</template>
