<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { usePageStore } from '@/stores/page'

usePageStore().pageData.title = 'Homepage'
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
