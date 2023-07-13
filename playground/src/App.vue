<script setup lang="ts">
import hljs from 'highlight.js'
import { copy } from 'lazy-js-utils'
import { transfer } from '../../src'
import 'highlight.js/styles/github.css'
const md = ref(`---
name: el-button
---
`)
const output = computed(() => hljs.highlight(transfer(md.value)!, { language: 'JSON' }).value)
</script>

<template>
  <div p5>
    <textarea id="" v-model="md" border-1 class="border-[#eee]" p2 w-full name="" cols="30" rows="10" text-dark-200 />
    <div flex items-center gap4>
      <div my4 v-html="output" /> <svg
        class="cursor-pointer group" xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" @click="copy(transfer(md)!)"
      >
        <path
          fill="#adbf88" class="group-hover:fill-green"
          d="M18 2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H9V4h9v12zM3 15v-2h2v2H3zm0-5.5h2v2H3v-2zM10 20h2v2h-2v-2zm-7-1.5v-2h2v2H3zM5 22c-1.1 0-2-.9-2-2h2v2zm3.5 0h-2v-2h2v2zm5 0v-2h2c0 1.1-.9 2-2 2zM5 6v2H3c0-1.1.9-2 2-2z"
        />
      </svg>
    </div>

    <div flex flex-col items-center justify-center>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
</style>
