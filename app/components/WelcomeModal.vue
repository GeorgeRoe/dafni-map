<script setup lang="ts">
const open = ref(false)

// Open on the client after mount so the statically generated page
// hydrates cleanly, then the popup appears on every visit.
onMounted(() => {
  open.value = true
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Welcome to the DAFNI Map"
    description="A work experience project hosted by DAFNI within STFC."
    :close="{ class: 'cursor-pointer' }"
  >
    <template #body>
      <div class="space-y-4 text-muted leading-relaxed">
        <p>
          This application was designed and built by
          <span class="font-semibold text-highlighted">two work experience students</span>
          during their placement with DAFNI. It isn't my work - the credit belongs to them.
        </p>

        <p>
          Throughout the project they showed a great work ethic and picked up new
          tools remarkably quickly, going from first steps with Vue, Nuxt and
          interactive maps to shipping a working application in a short space of time.
        </p>

        <p>
          Use the map to browse DAFNI's partners, filter them by stakeholder type and
          project, and click on any partner to find out more about their work.
        </p>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        label="Explore the map"
        trailing-icon="i-lucide-arrow-right"
        class="ml-auto cursor-pointer"
        @click="close"
      />
    </template>
  </UModal>
</template>
