<script setup lang="ts">
import hljs from 'highlight.js'
import { copy } from 'lazy-js-utils'
import { transfer } from '../../src'
import 'highlight.js/styles/github.css'
const md = ref(`---
name: el-button
---
`)
const isSuccess = ref(false)
const output = computed(
  () => hljs.highlight(transfer(md.value)!, { language: 'JSON' }).value,
)
const copyHandler = () => {
  isSuccess.value = copy(transfer(md.value)!)
  setTimeout(() => {
    isSuccess.value = false
  }, 500)
}
const paste = async () => {
  const content = await window.navigator.clipboard.readText()
  if (content)
    md.value += content
}
onMounted(paste)
</script>

<template>
  <div p5>
    <textarea
      id=""
      v-model="md"
      border-1
      class="border-[#eee]"
      p2
      w-full
      name=""
      cols="30"
      rows="10"
      text-dark-200
    />
    <div my4 v-html="output" />
    <svg
      v-if="!isSuccess"
      ma
      class="cursor-pointer group"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      @click="copyHandler"
    >
      <path
        fill="#adbf88"
        class="group-hover:fill-green"
        d="M18 2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H9V4h9v12zM3 15v-2h2v2H3zm0-5.5h2v2H3v-2zM10 20h2v2h-2v-2zm-7-1.5v-2h2v2H3zM5 22c-1.1 0-2-.9-2-2h2v2zm3.5 0h-2v-2h2v2zm5 0v-2h2c0 1.1-.9 2-2 2zM5 6v2H3c0-1.1.9-2 2-2z"
      />
    </svg>
    <svg
      v-if="isSuccess"
      ma
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 36 36"
    >
      <path
        fill="#8ac70f"
        d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2Zm0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14Z"
        class="clr-i-outline clr-i-outline-path-1"
      />
      <path
        fill="#8ac70f"
        d="M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42Z"
        class="clr-i-outline clr-i-outline-path-2"
      />
      <path fill="none" d="M0 0h36v36H0z" />
    </svg>
    <div flex flex-col items-center justify-center>
      <Footer />
    </div>
  </div>
</template>

<style scoped></style>
