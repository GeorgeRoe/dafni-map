<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()

const config = useRuntimeConfig()
const baseUrl = config.app.baseURL || '/'
</script>

<template>
  <img :src="`${baseUrl}${src}`" :alt="alt">
</template>