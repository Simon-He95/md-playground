<script setup lang="ts">
import { transfer } from '../../src'
const md = ref('')
const output = computed(() => transfer(md.value))
</script>

<template>
  <div p5>
    <textarea id="" v-model="md" border-1 class="border-#eee" p2 w-full name="" cols="30" rows="10" />
    <div>{{ output }}</div>
  </div>
</template>

<style scoped>
</style>
