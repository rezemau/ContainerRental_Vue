<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
});
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>
