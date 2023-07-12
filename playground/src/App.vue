<script setup lang="ts">
import hljs from 'highlight.js'
import { transfer } from '../../src'
import 'highlight.js/styles/github.css'
const md = ref('')
const output = computed(() => hljs.highlight(transfer(md.value)!, { language: 'JSON' }).value)
</script>

<template>
  <div p5>
    <textarea id="" v-model="md" border-1 class="border-[#eee]" p2 w-full name="" cols="30" rows="10" text-dark-200 />
    <div my4 v-html="output" />
    <div flex flex-col items-center justify-center>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
</style>
